import { Router } from 'express';
import { getDocuments, uploadDocument, deleteDocument, viewDocument } from '../controllers/documentController';
import { isAuthenticated } from '../middleware/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All document routes require authentication
router.use(isAuthenticated);

router.get('/', getDocuments);
router.get('/:id/view', viewDocument);
router.post('/upload', upload.array('files', 10), uploadDocument);
router.delete('/:id', deleteDocument);

export default router;
