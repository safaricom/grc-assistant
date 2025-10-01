import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
  MINIO_USE_SSL
} = process.env;

console.log('MinIO Configuration:', {
  endpoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  bucket: MINIO_BUCKET,
  useSSL: MINIO_USE_SSL,
  hasAccessKey: !!MINIO_ACCESS_KEY,
  hasSecretKey: !!MINIO_SECRET_KEY,
});

if (!MINIO_ENDPOINT || !MINIO_PORT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY || !MINIO_BUCKET) {
  const missing = [];
  if (!MINIO_ENDPOINT) missing.push('MINIO_ENDPOINT');
  if (!MINIO_PORT) missing.push('MINIO_PORT');
  if (!MINIO_ACCESS_KEY) missing.push('MINIO_ACCESS_KEY');
  if (!MINIO_SECRET_KEY) missing.push('MINIO_SECRET_KEY');
  if (!MINIO_BUCKET) missing.push('MINIO_BUCKET');
  throw new Error(`MinIO environment variables are not fully configured. Missing: ${missing.join(', ')}`);
}

const s3Client = new S3Client({
  endpoint: `${MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${MINIO_ENDPOINT}:${MINIO_PORT}`,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
  region: 'us-east-1', // Dummy region for MinIO
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to create the bucket if it doesn't exist, with retry logic
export const ensureBucketExists = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: MINIO_BUCKET! }));
      console.log(`Bucket ${MINIO_BUCKET} already exists.`);
      return; // Success, bucket exists
    } catch (error: any) {
      if (error.name === 'NotFound') {
        console.log(`Bucket ${MINIO_BUCKET} not found. Creating...`);
        await s3Client.send(new CreateBucketCommand({ Bucket: MINIO_BUCKET! }));
        console.log(`Bucket ${MINIO_BUCKET} created successfully.`);
        return; // Success, bucket was created
      }
      
      // For other errors like ECONNREFUSED, wait and retry
      if (i < retries - 1) {
        console.log(`Could not connect to MinIO. Retrying in ${delay / 1000} seconds... (${i + 1}/${retries})`);
        await sleep(delay);
      } else {
        console.error('Could not connect to MinIO after multiple retries.');
        throw error; // Final attempt failed, throw the error
      }
    }
  }
};

export const uploadFile = (storageKey: string, fileBuffer: Buffer, mimetype: string) => {
  const params = {
    Bucket: MINIO_BUCKET!,
    Key: storageKey,
    Body: fileBuffer,
    ContentType: mimetype,
  };
  return s3Client.send(new PutObjectCommand(params));
};

export const deleteFile = (storageKey: string) => {
  const params = {
    Bucket: MINIO_BUCKET!,
    Key: storageKey,
  };
  return s3Client.send(new DeleteObjectCommand(params));
};

export const getFileStream = async (storageKey: string) => {
  const params = {
    Bucket: MINIO_BUCKET!,
    Key: storageKey,
  };
  const { Body } = await s3Client.send(new GetObjectCommand(params));
  if (!Body || !(Body instanceof Readable)) {
    throw new Error('Could not read file from storage.');
  }
  return Body;
};