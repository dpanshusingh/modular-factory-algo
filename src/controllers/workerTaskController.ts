import { Request, Response } from 'express'; // Ensure express types are installed
import { MatchingService } from '../services/matchingService';
import { PlanningService } from '../services/planningService';
import { MatchRequest, PlanRequest, WorkerTask } from '../types';

export class WorkerTaskController {
    private matchingService: MatchingService;
    private planningService: PlanningService;

    constructor() {
        this.matchingService = new MatchingService();
        this.planningService = new PlanningService();
    }

    public match = async (req: Request, res: Response) => {
        try {
            const body = req.body as MatchRequest;
            // Basic validation could go here
            const results = this.matchingService.match(body.workers, body.tasks, body.workerTasks);
            res.json({ workerTasks: results });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

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
