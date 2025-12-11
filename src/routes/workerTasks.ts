import { Router } from 'express';
import { WorkerTaskController } from '../controllers/workerTaskController';

const router = Router();
const controller = new WorkerTaskController();

router.post('/plan', controller.plan);

export default router;
