
import { Worker, Task, WorkerTask } from '../types';
import { loadWorkerPreferences, WorkerPreferences } from '../utils/preferenceLoader';

interface AssignmentResult {
    results: WorkerTask[]; // New assignments created
    assignedWorkerIds: string[]; // Workers who got busy
    taskProgress: Map<string, number>; // TaskId -> LaborHours done in this step
}

export class BalancingService {
    private workerPreferences: WorkerPreferences;

    constructor(preferenceFilePath: string = './Worker-Task algo data - Workers.csv') {
        try {
            this.workerPreferences = loadWorkerPreferences(preferenceFilePath);
            console.log(`[BalancingService] Loaded preferences for ${Object.keys(this.workerPreferences).length} workers.`);
        } catch (error) {
            console.error("[BalancingService] Failed to load worker preferences:", error);
            this.workerPreferences = {};
        }
    }

    /**
     * Assigns available workers to ready tasks based on Skills, Preferences, and Continuity.
     */
    public balance(
        currentTime: number,
        stepDurationMs: number,
        availableWorkers: Worker[],
        readyTasks: Array<{ task: Task; remainingHours: number, assignedWorkers: Set<string> }>,
        lastAssignedTask: Map<string, string>, // WorkerId -> TaskId (State)
        endTimeLimit: number
    ): AssignmentResult {

        const results: WorkerTask[] = [];
        const assignedWorkerIds: string[] = [];
        const taskProgress = new Map<string, number>();

        // Sort Tasks (Heuristic: Longest Remaining Work First)
        // This is a "Greedy" strategy regarding task priority
        readyTasks.sort((a, b) => b.remainingHours - a.remainingHours);

        for (const item of readyTasks) {
            const { task } = item;

            // Check if we ran out of workers
            if (availableWorkers.length === 0) break;

            const max = task.maxWorkers || 100;

            // Filter Eligible
            const eligible = availableWorkers.filter(w => {
                // 1. Skill Check
                if (!this.hasSkills(w, task)) return false;

                // 2. Preference Check (4 = Cannot Help)
                const pref = this.getWorkerPreference(w, task.name || "");
                if (pref === 4) return false;

                return true;
            });

            // Sort Eligible (Best Match)
            eligible.sort((w1, w2) => {
                const pref1 = this.getWorkerPreference(w1, task.name || "");
                const pref2 = this.getWorkerPreference(w2, task.name || "");

                const last1 = lastAssignedTask.get(w1.workerId);
                const last2 = lastAssignedTask.get(w2.workerId);

                // Continuity Bonus: 0.5 if staying on same task
                const bonus1 = (last1 === task.taskId) ? 0.5 : 0;
                const bonus2 = (last2 === task.taskId) ? 0.5 : 0;

                return (pref1 - bonus1) - (pref2 - bonus2);
            });

            // Assign
            let assignedCount = 0;
            const currentStepHours = stepDurationMs / (1000 * 60 * 60);

            for (const worker of eligible) {
                if (assignedCount >= max) break;

                // Assign
                assignedCount++;
                assignedWorkerIds.push(worker.workerId);

                // Track Continuity
                lastAssignedTask.set(worker.workerId, task.taskId);

                // Create Output
                const endDate = Math.min(currentTime + stepDurationMs, endTimeLimit);
                results.push({
                    workerId: worker.workerId,
                    taskId: task.taskId,
                    startDate: new Date(currentTime).toISOString(),
                    endDate: new Date(endDate).toISOString()
                });

                // Remove from available local list
                const idx = availableWorkers.indexOf(worker);
                if (idx > -1) availableWorkers.splice(idx, 1);
            }

            if (assignedCount > 0) {
                const laborDone = assignedCount * currentStepHours;
                taskProgress.set(task.taskId, laborDone);
            }
        }

        return { results, assignedWorkerIds, taskProgress };
    }

    private getWorkerPreference(worker: Worker, taskName: string): number {
        // 1. JSON Override
        if (worker.preferences && worker.preferences[taskName] !== undefined) {
            return worker.preferences[taskName];
        }
        // 2. CSV Lookup
        const workerPrefs = this.workerPreferences[worker.name || ""];
        if (!workerPrefs) return 3; // Default 'Can Help' if unknown
        return workerPrefs[taskName] !== undefined ? workerPrefs[taskName] : 3;
    }

    private hasSkills(worker: Worker, task: Task): boolean {
        if (!task.requiredSkills || task.requiredSkills.length === 0) return true;
        const workerSkills = new Set(worker.skills);
        return task.requiredSkills.every(req => workerSkills.has(req));
    }
}
