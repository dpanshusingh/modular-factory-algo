import { Router } from 'express';
import { WorkerTaskController } from '../controllers/workerTaskController';

const router = Router();
const controller = new WorkerTaskController();

router.post('/match', controller.match);
router.post('/plan', controller.plan);

export default router;
