import { Worker, Task, WorkerTask, PlanRequest } from '../types';
import { parseDate } from '../utils/timeUtils';
import { computeEstimatedTotalLaborHours } from '../utils/estimation';
import { BalancingService } from './balancingService';

interface SimulationState {
    tasks: Map<string, {
        task: Task;
        remainingHours: number;
        isComplete: boolean;
        assignedWorkers: Set<string>;
    }>;
    workers: Map<string, {
        worker: Worker;
        busyUntil: number;
    }>;
}

export class PlanningService {
    private readonly TIME_STEP_MINUTES = 30; // 30 minute blocks
    private balancingService: BalancingService;

    constructor() {
        this.balancingService = new BalancingService('./Worker-Task algo data - Workers.csv');
    }

    public plan(request: PlanRequest): WorkerTask[] {
        console.log('--- START PLANNING ---');
        const { workers, tasks, interval, useHistorical } = request;
        console.log(`Inputs: ${workers.length} workers, ${tasks.length} tasks`);

        const startTimeVals = parseDate(interval.startTime).getTime();
        const endTimeVals = parseDate(interval.endTime).getTime();

        // 1. Initialize Estimates
        tasks.forEach(t => {
            if (t.estimatedTotalLaborHours === undefined) {
                const computed = computeEstimatedTotalLaborHours(t);
                if (typeof computed === 'number') {
                    t.estimatedTotalLaborHours = computed;
                } else {
                    const base = t.minWorkers ? t.minWorkers * 4 : 4;
                    t.estimatedTotalLaborHours = useHistorical ? base * 0.9 : base;
                }
            }
            if (t.estimatedRemainingLaborHours === undefined) {
                t.estimatedRemainingLaborHours = t.estimatedTotalLaborHours;
            }
        });

        // 2. Setup Simulation State
        const state: SimulationState = {
            tasks: new Map(tasks.map(t => [t.taskId, {
                task: t,
                remainingHours: t.estimatedRemainingLaborHours!,
                isComplete: t.estimatedRemainingLaborHours! <= 0,
                assignedWorkers: new Set()
            }])),
            workers: new Map(workers.map(w => [w.workerId, {
                worker: w,
                busyUntil: startTimeVals
            }]))
        };

        const results: WorkerTask[] = [];
        const stepMs = this.TIME_STEP_MINUTES * 60 * 1000;
        let currentTime = startTimeVals;
        const lastAssignedTask = new Map<string, string>();

        // 3. Time Loop
        while (currentTime < endTimeVals) {
            if (this.allTasksComplete(state)) {
                console.log('All tasks complete. Breaking loop.');
                break;
            }

            // A. Identify Available Workers
            const availableWorkers = workers.filter(w => {
                const wState = state.workers.get(w.workerId)!;
                if (wState.busyUntil > currentTime) return false;

                if (w.availability && !Array.isArray(w.availability)) {
                    const availStart = parseDate(w.availability.startTime).getTime();
                    const availEnd = parseDate(w.availability.endTime).getTime();
                    // Basic constraint check
                    if (!isNaN(availStart) && !isNaN(availEnd)) {
                        if (currentTime < availStart || currentTime >= availEnd) return false;
                    }
                }
                return true;
            });

            // B. Identify Ready Tasks
            const readyTasks = this.getReadyTasks(state, currentTime);

            // C. DELEGATE TO BALANCING SERVICE
            const assignment = this.balancingService.balance(
                currentTime,
                stepMs,
                [...availableWorkers], // Pass copy to avoid mutation confusion (though service does splice)
                readyTasks, // Contains { task, remainingHours, assignedWorkers } matches signature? Need Check.
                // The service expects { task: Task; remainingHours: number, assignedWorkers: Set<string> }
                // My 'readyTasks' returns the state object directly? No, getReadyTasks returns filtered array of state objects.
                // So yes, it matches.
                lastAssignedTask,
                endTimeVals
            );

            // D. Apply Updates
            // 1. Add new records
            results.push(...assignment.results);

            // 2. Update Worker Busy State
            assignment.assignedWorkerIds.forEach(wid => {
                const wState = state.workers.get(wid)!;
                wState.busyUntil = currentTime + stepMs;
            });

            // 3. Update Task Progress
            assignment.taskProgress.forEach((hoursDone, taskId) => {
                const tState = state.tasks.get(taskId)!;
                tState.remainingHours -= hoursDone;

                // Track workers for context (read only by us anyway, updated by balance service?)
                // Actually the service reads 'assignedWorkers' set from previous step context?
                // The service logic for 'assignedWorkers' property on Task State isn't strictly used by logic, 
                // but might be useful for visualization later. 
                // For now, let's just mark complete.
                if (tState.remainingHours <= 0) {
                    tState.isComplete = true;
                    tState.remainingHours = 0;
                }
            });

            currentTime += stepMs;
        }

        console.log(`--- PLANNING COMPLETE: Generated ${results.length} assignments ---`);
        return results;
    }

    private allTasksComplete(state: SimulationState): boolean {
        return Array.from(state.tasks.values()).every(t => t.isComplete);
    }

    private getReadyTasks(state: SimulationState, time: number) {
        const incomplete = Array.from(state.tasks.values()).filter(t => !t.isComplete);

        return incomplete.filter(item => {
            // Check Start Date
            if (item.task.earliestStartDate) {
                const start = parseDate(item.task.earliestStartDate).getTime();
                if (time < start) return false;
            }

            // Check Prerequisites
            if (item.task.prerequisiteTaskIds && item.task.prerequisiteTaskIds.length > 0) {
                const allPrereqsDone = item.task.prerequisiteTaskIds.every(pid => {
                    const pState = state.tasks.get(pid);
                    return pState && pState.isComplete;
                });
                if (!allPrereqsDone) return false;
            }
            return true;
        });
    }
}
