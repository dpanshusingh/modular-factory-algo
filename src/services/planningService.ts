import { Worker, Task, WorkerTask, PlanRequest } from '../types';
import { parseDate } from '../utils/timeUtils';
import { computeEstimatedTotalLaborHours } from '../utils/estimation';

interface SimulationState {
    tasks: Map<string, {
        task: Task;
        remainingHours: number;
        isComplete: boolean;
        assignedWorkers: Set<string>; // WorkerIds currently assigned (context switching optimization)
    }>;
    workers: Map<string, {
        worker: Worker;
        busyUntil: number; // Timestamp
    }>;
}

export class PlanningService {
    private readonly TIME_STEP_MINUTES = 30; // 30 minute blocks

    public plan(request: PlanRequest): WorkerTask[] {
        const { workers, tasks, interval, useHistorical } = request;
        const startTimeVals = parseDate(interval.startTime).getTime();
        const endTimeVals = parseDate(interval.endTime).getTime();

        // 1. Initialize Estimates
        tasks.forEach(t => {
            // Try realistic estimator first (if task includes module/time-study data)
            if (t.estimatedTotalLaborHours === undefined) {
                const computed = computeEstimatedTotalLaborHours(t);
                if (typeof computed === 'number') {
                    t.estimatedTotalLaborHours = computed;
                } else {
                    // Fallback mock calculation
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

        // 3. Time Loop
        let currentTime = startTimeVals;

        while (currentTime < endTimeVals) {
            if (this.allTasksComplete(state)) break;

            // Identify Available Workers at this slice
            const availableWorkers = workers.filter(w => {
                const wState = state.workers.get(w.workerId)!;
                if (wState.busyUntil > currentTime) return false;

                // Check Explicit Availability
                if (w.availability) {
                    const availStart = parseDate(w.availability.startTime).getTime();
                    const availEnd = parseDate(w.availability.endTime).getTime();
                    if (currentTime < availStart || currentTime >= availEnd) return false;
                }

                return true;
            });

            // Identify Ready Tasks
            const readyTasks = this.getReadyTasks(state, currentTime);

            // Sort Tasks (Heuristic: Longest Remaining Work First -> effectively Critical Pathish)
            // Also prioritize tasks that have 'minWorkers' to meet urgency?
            // Optimization: "Focus on finishing tasks". 
            readyTasks.sort((a, b) => b.remainingHours - a.remainingHours);

            // Assign Process
            for (const item of readyTasks) {
                const { task, remainingHours } = item; // item is the state object

                if (availableWorkers.length === 0) break;

                // Requirements
                const max = task.maxWorkers || 100;
                const min = task.minWorkers || 1;

                // Filter eligible workers (Skills)
                // Optimization: Prefer workers "already assigned" to this task (Continuity)
                const eligible = availableWorkers.filter(w => this.hasSkills(w, task));

                // Sort eligible: 
                // 1. Worker was working on this last step (Stickiness)
                // 2. Skill ranking (Mocked here as simple "fits")
                eligible.sort((w1, w2) => {
                    const w1Active = item.assignedWorkers.has(w1.workerId) ? 1 : 0;
                    const w2Active = item.assignedWorkers.has(w2.workerId) ? 1 : 0;
                    return w2Active - w1Active;
                });

                // Determine how many to assign
                // We WANT to assign up to MAX to finish early (Optimization Strategy)
                // But we MUST assign at least MIN if we start it? 
                // If we can't meet MIN, strict scheduling might overlap. 
                // For this prompt, let's do "Best Effort" filling.

                let assignedCount = 0;
                const assignedWids: string[] = [];

                for (const worker of eligible) {
                    if (assignedCount >= max) break;

                    // Assign
                    assignedCount++;
                    assignedWids.push(worker.workerId);

                    // Update Worker State
                    const wState = state.workers.get(worker.workerId)!;
                    wState.busyUntil = currentTime + stepMs;

                    // Record Output
                    const endDate = Math.min(currentTime + stepMs, endTimeVals);
                    results.push({
                        workerId: worker.workerId,
                        taskId: task.taskId,
                        startDate: new Date(currentTime).toISOString(),
                        endDate: new Date(endDate).toISOString()
                    });

                    // Remove from available for this step
                    const index = availableWorkers.indexOf(worker);
                    if (index > -1) availableWorkers.splice(index, 1);
                }

                // Update Task State
                // Labor accomplished: assignedCount * (step in hours)
                const laborDone = assignedCount * (this.TIME_STEP_MINUTES / 60);
                item.remainingHours -= laborDone;

                // Track who is working for continuity next step
                item.assignedWorkers = new Set(assignedWids);

                if (item.remainingHours <= 0) {
                    item.isComplete = true;
                    item.remainingHours = 0;
                }
            }

            currentTime += stepMs;
        }

        return results;
    }

    private allTasksComplete(state: SimulationState): boolean {
        return Array.from(state.tasks.values()).every(t => t.isComplete);
    }

    private getReadyTasks(state: SimulationState, time: number) {
        const incomplete = Array.from(state.tasks.values()).filter(t => !t.isComplete);

        return incomplete.filter(item => {
            // 1. Check Earliest Start Date
            if (item.task.earliestStartDate) {
                const start = parseDate(item.task.earliestStartDate).getTime();
                if (time < start) return false;
            }

            // 2. Check Prerequisites
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

    private hasSkills(worker: Worker, task: Task): boolean {
        if (!task.requiredSkills || task.requiredSkills.length === 0) return true;
        const workerSkills = new Set(worker.skills);
        return task.requiredSkills.every(req => workerSkills.has(req));
    }
}
