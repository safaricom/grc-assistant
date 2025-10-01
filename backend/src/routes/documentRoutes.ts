import { Router } from 'express';
import { getDocuments, uploadDocument, deleteDocument, viewDocument } from '../controllers/documentController';
import { isAuthenticated } from '../middleware/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All document routes require authentication
router.use(isAuthenticated);

// List
router.get('/', getDocuments);

// View by id (alias for compatibility)
router.get('/:id', viewDocument);
router.get('/:id/view', viewDocument);

// Uploads: accept POST /api/documents as well as /api/documents/upload
router.post('/', upload.array('files', 10), uploadDocument);
router.post('/upload', upload.array('files', 10), uploadDocument);

// Delete
router.delete('/:id', deleteDocument);

export default router;
