import { Request, Response } from 'express';
import { db } from '../lib/db';
import { documents } from '../lib/db/schema';
import { uploadFile, deleteFile, getFileStream } from '../lib/s3';
import { eq } from 'drizzle-orm';
import path from 'path';

export const viewDocument = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const doc = await db.query.documents.findFirst({
      where: eq(documents.id, id),
    });

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Set headers to instruct the browser on how to handle the file
    res.setHeader('Content-Type', doc.fileType);
    res.setHeader('Content-Disposition', `inline; filename="${doc.fileName}"`);

    const fileStream = await getFileStream(doc.storageKey);
    
    // Pipe the file stream from S3 to the response
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error viewing document:', error);
    res.status(500).json({ message: 'Failed to view document' });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const allDocuments = await db.query.documents.findMany({
      with: {
        uploader: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: (documents, { desc }) => [desc(documents.createdAt)],
    });
    console.log(`Successfully fetched ${allDocuments.length} documents`);
    res.json(allDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed error:', errorMessage);
    res.status(500).json({ 
      message: 'Failed to fetch documents',
      error: errorMessage 
    });
  }
};

export const uploadDocument = async (req: Request, res: Response) => {
  const uploadedDocuments: { storageKey: string; originalName: string }[] = [];
  
  try {
    console.log('Upload request received');
    console.log('Files:', req.files);
    console.log('User:', req.user);
    
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      console.log('No files in request');
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    console.log(`Processing ${files.length} file(s)`);

    const user = req.user as { id: string };
    if (!user || !user.id) {
      console.error('User not authenticated or missing ID');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    console.log(`User ID: ${user.id}`);
    const { v4: uuidv4 } = await import('uuid');
    
    const newDocuments = await db.transaction(async (tx) => {
      const documentPromises = files.map(async (file) => {
        console.log(`Processing file: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`);
        const fileExtension = path.extname(file.originalname);
        const storageKey = `documents/${uuidv4()}${fileExtension}`;

        console.log(`Uploading to MinIO: ${storageKey}`);
        // Upload to S3
        await uploadFile(storageKey, file.buffer, file.mimetype);
        console.log(`Successfully uploaded to MinIO: ${storageKey}`);
        uploadedDocuments.push({ storageKey, originalName: file.originalname });

        // Prepare insert values
        return {
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          storageKey: storageKey,
          uploadedById: user.id,
        };
      });

      const documentsToInsert = await Promise.all(documentPromises);
      
      if (documentsToInsert.length === 0) {
        return [];
      }

      console.log(`Inserting ${documentsToInsert.length} document(s) into database`);
      // Insert all document records into the database
      const result = await tx.insert(documents).values(documentsToInsert).returning();
      console.log(`Successfully inserted ${result.length} document(s) into database`);
      return result;
    });

    console.log('Upload completed successfully');
    res.status(201).json(newDocuments);
  } catch (error) {
    console.error('Error uploading documents:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error details:', errorMessage);
    console.error('Error stack:', errorStack);

    // If there's an error, clean up all files that were successfully uploaded to S3
    if (uploadedDocuments.length > 0) {
      console.log(`Cleaning up ${uploadedDocuments.length} S3 objects due to an error.`);
      const cleanupPromises = uploadedDocuments.map((doc: { storageKey: string; originalName: string }) => 
        deleteFile(doc.storageKey).catch((cleanupError: Error) => {
          console.error(`Failed to cleanup S3 object ${doc.storageKey} for ${doc.originalName}:`, cleanupError);
        })
      );
      await Promise.all(cleanupPromises);
    }

    res.status(500).json({ 
      message: 'Failed to upload documents',
      error: errorMessage 
    });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const docToDelete = await db.query.documents.findFirst({
        where: eq(documents.id, id),
    });

    if (!docToDelete) {
        return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from S3 first
    await deleteFile(docToDelete.storageKey);

    // Then delete the record from the database
    await db.delete(documents).where(eq(documents.id, id));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Failed to delete document' });
  }
};
