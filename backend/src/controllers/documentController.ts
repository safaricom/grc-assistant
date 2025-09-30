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
    res.json(allDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
};

export const uploadDocument = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  const user = req.user as { id: string };
  const { v4: uuidv4 } = await import('uuid');
  
  const uploadedDocuments: { storageKey: string; originalName: string }[] = [];
  
  try {
    const newDocuments = await db.transaction(async (tx) => {
      const documentPromises = files.map(async (file) => {
        const fileExtension = path.extname(file.originalname);
        const storageKey = `documents/${uuidv4()}${fileExtension}`;

        // Upload to S3
        await uploadFile(storageKey, file.buffer, file.mimetype);
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

      // Insert all document records into the database
      return tx.insert(documents).values(documentsToInsert).returning();
    });

    res.status(201).json(newDocuments);
  } catch (error) {
    console.error('Error uploading documents:', error);

    // If there's an error, clean up all files that were successfully uploaded to S3
    if (uploadedDocuments.length > 0) {
      console.log(`Cleaning up ${uploadedDocuments.length} S3 objects due to an error.`);
      const cleanupPromises = uploadedDocuments.map(doc => 
        deleteFile(doc.storageKey).catch(cleanupError => {
          console.error(`Failed to cleanup S3 object ${doc.storageKey} for ${doc.originalName}:`, cleanupError);
        })
      );
      await Promise.all(cleanupPromises);
    }

    res.status(500).json({ message: 'Failed to upload documents' });
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
