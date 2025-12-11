import { Request, Response } from 'express'; // Ensure express types are installed
import { PlanningService } from '../services/planningService';
import { PlanRequest } from '../types';

export class WorkerTaskController {
    private planningService: PlanningService;

    constructor() {
        this.planningService = new PlanningService();
    }

    public plan = async (req: Request, res: Response) => {
        try {
            const body = req.body as PlanRequest;
            const results = this.planningService.plan(body);
            res.json({ items: results });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}
