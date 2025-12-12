import { Request, Response } from 'express'; // Ensure express types are installed
import { PlanningService } from '../services/planningService';
import { PlanRequest } from '../types';
import { parseExcelData } from '../utils/excelLoader';

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

    public planFromFile = async (req: Request, res: Response) => {
        try {
            const file = req.file;
            if (!file) {
                res.status(400).send("No file uploaded.");
                return;
            }

            // Parse File
            const { workers, tasks } = parseExcelData(file.buffer);

            // Get Interval from Form Data or Default
            const startTime = req.body.startTime || "2024-01-01T08:00:00Z";
            const endTime = req.body.endTime || "2024-01-01T17:00:00Z";

            const requestData: PlanRequest = {
                workers,
                tasks,
                interval: { startTime, endTime },
                useHistorical: false
            };

            console.log("Plan From File Request:", `${workers.length} workers, ${tasks.length} tasks`);

            const planningService = new PlanningService();
            // Note: Service usually loads preferences from local CSV.
            // But excelLoader populates 'worker.preferences' which takes precedence in getWorkerPreference()!
            // So logic is preserved.

            const assignments = planningService.plan(requestData);

            res.json({ items: assignments });

        } catch (error) {
            console.error("Planning File Error:", error);
            res.status(500).send("Internal Server Error: " + error);
        }
    };
}
