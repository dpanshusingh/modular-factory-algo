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

    // Mock Data based on "Worker-Task algo data - Workers.csv"
    private readonly WORKER_PREFERENCES: Record<string, Record<string, number>> = {
        "Greydis Salguera": {
            "Wall Batt insulation": 1, "Baffels and Blown In Insulation": 1, "Ceiling Rim Insulation": 1,
            "Complete Drywall Back Panel": 3, "Complete Exterior OSB": 2, "Complete Roof 5/8\" OSB": 2,
            "Complete Exterior Fire Wall": 3, "Interior Tape / Mud 1st Coat": 3, "Interior Tape / Mud 2nd Coat": 3,
            "Complete Exterior R-Max": 3, "Tape and install windows": 4
        },
        "Angel Rodriguez": {
            "Wall Batt insulation": 1, "Baffels and Blown In Insulation": 1, "Ceiling Rim Insulation": 1,
            "Complete Drywall Back Panel": 3, "Complete Exterior OSB": 2, "Complete Roof 5/8\" OSB": 2,
            "Complete Exterior Fire Wall": 3, "Interior Tape / Mud 1st Coat": 3, "Interior Tape / Mud 2nd Coat": 3,
            "Complete Exterior R-Max": 3, "Tape and install windows": 4
        },
        "Jose Alfredo Galaviz": {
            "Wall Batt insulation": 3, "Baffels and Blown In Insulation": 3, "Ceiling Rim Insulation": 3,
            "Complete Drywall Back Panel": 3, "Complete Exterior OSB": 1, "Complete Roof 5/8\" OSB": 1,
            "Complete Exterior Fire Wall": 3, "Interior Tape / Mud 1st Coat": 3, "Interior Tape / Mud 2nd Coat": 3,
            "Complete Exterior R-Max": 2, "Tape and install windows": 4
        },
        "Neudys Perez Santana": {
            "Wall Batt insulation": 3, "Baffels and Blown In Insulation": 3, "Ceiling Rim Insulation": 3,
            "Complete Drywall Back Panel": 4, "Complete Exterior OSB": 1, "Complete Roof 5/8\" OSB": 1,
            "Complete Exterior Fire Wall": 4, "Interior Tape / Mud 1st Coat": 4, "Interior Tape / Mud 2nd Coat": 4,
            "Complete Exterior R-Max": 3, "Tape and install windows": 3
        },
        "Uriel Ruiz Cruz": {
            "Wall Batt insulation": 3, "Baffels and Blown In Insulation": 3, "Ceiling Rim Insulation": 3,
            "Complete Drywall Back Panel": 4, "Complete Exterior OSB": 1, "Complete Roof 5/8\" OSB": 1,
            "Complete Exterior Fire Wall": 4, "Interior Tape / Mud 1st Coat": 4, "Interior Tape / Mud 2nd Coat": 4,
            "Complete Exterior R-Max": 3, "Tape and install windows": 3
        },
        "Carlos Lopez": {
            "Wall Batt insulation": 3, "Baffels and Blown In Insulation": 3, "Ceiling Rim Insulation": 3,
            "Complete Drywall Back Panel": 4, "Complete Exterior OSB": 3, "Complete Roof 5/8\" OSB": 3,
            "Complete Exterior Fire Wall": 4, "Interior Tape / Mud 1st Coat": 4, "Interior Tape / Mud 2nd Coat": 4,
            "Complete Exterior R-Max": 3, "Tape and install windows": 1
        }
    };

    private getWorkerPreference(workerName: string, taskName: string): number {
        // Default to 3 (Can Help) if not explicitly found, unless strict
        const workerPrefs = this.WORKER_PREFERENCES[workerName];
        if (!workerPrefs) return 3;

        // Exact match
        if (workerPrefs[taskName] !== undefined) return workerPrefs[taskName];

        // Fuzzy match? (Optional, skipping for now as per strict requirement)
        return 3;
    }

    public plan(request: PlanRequest): WorkerTask[] {
        console.log('--- START PLANNING ---');
        const { workers, tasks, interval, useHistorical } = request;
        console.log(`Inputs: ${workers.length} workers, ${tasks.length} tasks`);
        console.log(`Interval: ${interval.startTime} to ${interval.endTime}`);

        const startTimeVals = parseDate(interval.startTime).getTime();
        const endTimeVals = parseDate(interval.endTime).getTime();
        console.log(`Parsed Time: ${startTimeVals} to ${endTimeVals}`);

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
            if (this.allTasksComplete(state)) {
                console.log('All tasks complete. Breaking loop.');
                break;
            }

            // Identify Available Workers at this slice
            const availableWorkers = workers.filter(w => {
                const wState = state.workers.get(w.workerId)!;
                if (wState.busyUntil > currentTime) return false;

                // Check Explicit Availability
                if (w.availability && !Array.isArray(w.availability)) {
                    // Frontend might send [] which is truthy but wrong type.
                    // Fix: strict check or handle it.
                    const availStart = parseDate(w.availability.startTime).getTime();
                    const availEnd = parseDate(w.availability.endTime).getTime();
                    if (Number.isNaN(availStart) || Number.isNaN(availEnd)) {
                        console.warn(`Worker ${w.workerId} has invalid availability:`, w.availability);
                        return true; // Default to available? or false?
                    }

                    if (currentTime < availStart || currentTime >= availEnd) return false;
                }

                return true;
            });

            // Identify Ready Tasks
            const readyTasks = this.getReadyTasks(state, currentTime);
            if (readyTasks.length > 0 && results.length === 0) {
                console.log(`First Step ${new Date(currentTime).toISOString()}: Found ${readyTasks.length} ready tasks and ${availableWorkers.length} available workers.`);
            }

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

                // Filter eligible workers (Skills AND Preferences)
                const eligible = availableWorkers.filter(w => {
                    // 1. Skill Check
                    if (!this.hasSkills(w, task)) return false;

                    // 2. Preference Check
                    // If preference is 4 (CAN NOT HELP), exclude.
                    const pref = this.getWorkerPreference(w.name || "", task.name || "");
                    if (pref === 4) return false;

                    return true;
                });

                // Sort eligible: 
                // 1. Preference Score (Ascending: 1 is best)
                // 2. Worker was working on this last step (Stickiness)
                eligible.sort((w1, w2) => {
                    const pref1 = this.getWorkerPreference(w1.name || "", task.name || "");
                    const pref2 = this.getWorkerPreference(w2.name || "", task.name || "");

                    if (pref1 !== pref2) {
                        return pref1 - pref2; // Lower is better
                    }

                    const w1Active = item.assignedWorkers.has(w1.workerId) ? 1 : 0;
                    const w2Active = item.assignedWorkers.has(w2.workerId) ? 1 : 0;
                    return w2Active - w1Active; // Higher is better (Active first)
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

        console.log(`--- PLANNING COMPLETE: Generated ${results.length} assignments ---`);
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
