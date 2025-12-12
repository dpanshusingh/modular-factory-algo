import { Router } from 'express';
import { WorkerTaskController } from '../controllers/workerTaskController';

const router = Router();
const controller = new WorkerTaskController();
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

router.post('/plan', controller.plan);
router.post('/plan-file', upload.single('file'), controller.planFromFile);

export default router;
