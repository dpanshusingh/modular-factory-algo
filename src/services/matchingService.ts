import { Worker, Task, WorkerTask } from '../types';
import { getOverlap, parseDate } from '../utils/timeUtils';

export class MatchingService {

    public match(workers: Worker[], tasks: Task[], workerTasks: WorkerTask[]): WorkerTask[] {
        // 1. Separate Supply (Available Workers) and Demand (Unassigned Tasks)
        // We treat 'supply' as a mutable pool of availability.
        let availableWorkerIntervals = workerTasks
            .filter(wt => wt.workerId !== null && wt.taskId === null)
            .map(wt => ({
                ...wt,
                startDateVal: parseDate(wt.startDate).getTime(),
                endDateVal: parseDate(wt.endDate).getTime()
            }));

        const demandIntervals = workerTasks
            .filter(wt => wt.workerId === null && wt.taskId !== null)
            .map(wt => ({
                ...wt,
                startDateVal: parseDate(wt.startDate).getTime(),
                endDateVal: parseDate(wt.endDate).getTime()
            }));

        const results: WorkerTask[] = [];

        // 2. Map for quick lookups
        const workermap = new Map(workers.map(w => [w.workerId, w]));
        const taskMap = new Map(tasks.map(t => [t.taskId, t]));

        // 3. Process Demand
        // We process demand intervals. If a match is found, we consume worker availability.
        // If a demand interval is only partially filled, the remainder stays as demand? 
        // The spec implementation pseudocode: "FOR each unassigned task interval... split interval if needed... reduce worker's available window".

        // To handle splitting correctly without infinite loops, we can use a queue of demands.
        const demandQueue = [...demandIntervals];

        while (demandQueue.length > 0) {
            const currentDemand = demandQueue.shift()!;
            const task = taskMap.get(currentDemand.taskId!);

            if (!task) {
                // Should not happen given valid input, but push back as unassigned if no task info
                results.push({
                    workerId: null,
                    taskId: currentDemand.taskId,
                    startDate: currentDemand.startDate,
                    endDate: currentDemand.endDate
                });
                continue;
            }

            // Find candidates
            const candidates = [];

            for (let i = 0; i < availableWorkerIntervals.length; i++) {
                const supply = availableWorkerIntervals[i];

                // Check Overlap
                const overlap = getOverlap(
                    new Date(currentDemand.startDateVal),
                    new Date(currentDemand.endDateVal),
                    new Date(supply.startDateVal),
                    new Date(supply.endDateVal)
                );

                if (overlap) {
                    const worker = workermap.get(supply.workerId!);
                    if (worker && this.hasRequiredSkills(worker, task)) {
                        candidates.push({
                            supplyIndex: i,
                            worker,
                            overlap,
                            supply
                        });
                    }
                }
            }

            if (candidates.length === 0) {
                // No one can take this demand (or part of it). 
                // Just output it as unassigned.
                results.push({
                    workerId: null,
                    taskId: currentDemand.taskId,
                    startDate: new Date(currentDemand.startDateVal).toISOString(),
                    endDate: new Date(currentDemand.endDateVal).toISOString()
                });
                continue;
            }

            // Score Candidates
            // Scoring: Skill Rank + Task Switching (Mocked for now as 0 or we can try to infer)
            // For simple match, 'task switching' might not be fully trackable unless we know previous state.
            // We'll focus on Skill Rank.
            candidates.sort((a, b) => {
                const scoreA = this.calculateScore(a.worker, task);
                const scoreB = this.calculateScore(b.worker, task);
                return scoreB - scoreA; // Descending
            });

            const bestMatch = candidates[0];

            // CREATE ASSIGNMENT
            const assignmentStart = bestMatch.overlap.start.getTime();
            const assignmentEnd = bestMatch.overlap.end.getTime();

            results.push({
                workerId: bestMatch.worker.workerId,
                taskId: task.taskId,
                startDate: new Date(assignmentStart).toISOString(),
                endDate: new Date(assignmentEnd).toISOString()
            });

            // MANAGE SPLITS (Demand)
            // If match didn't cover start of demand
            if (assignmentStart > currentDemand.startDateVal) {
                demandQueue.push({
                    workerId: null,
                    taskId: task.taskId,
                    startDate: currentDemand.startDate, // Keep original string? Or update.
                    endDate: currentDemand.endDate,
                    startDateVal: currentDemand.startDateVal,
                    endDateVal: assignmentStart
                } as any);
            }
            // If match didn't cover end of demand
            if (assignmentEnd < currentDemand.endDateVal) {
                demandQueue.push({
                    workerId: null,
                    taskId: task.taskId,
                    startDate: currentDemand.startDate,
                    endDate: currentDemand.endDate,
                    startDateVal: assignmentEnd,
                    endDateVal: currentDemand.endDateVal
                } as any);
            }

            // MANAGE SPLITS (Supply)
            // Check the supply item we used. We need to "reduce" it.
            const usedSupply = bestMatch.supply;
            const supplyIndex = bestMatch.supplyIndex;

            // Remove original supply
            availableWorkerIntervals.splice(supplyIndex, 1);

            // Add back remainders
            if (usedSupply.startDateVal < assignmentStart) {
                availableWorkerIntervals.push({
                    ...usedSupply,
                    startDate: usedSupply.startDate,
                    endDate: new Date(assignmentStart).toISOString(),
                    endDateVal: assignmentStart
                });
            }
            if (usedSupply.endDateVal > assignmentEnd) {
                availableWorkerIntervals.push({
                    ...usedSupply,
                    startDate: new Date(assignmentEnd).toISOString(),
                    endDate: usedSupply.endDate,
                    startDateVal: assignmentEnd
                });
            }
        }

        // Add any remaining unused supply as "Idle"
        for (const supply of availableWorkerIntervals) {
            results.push({
                workerId: supply.workerId,
                taskId: null,
                startDate: new Date(supply.startDateVal).toISOString(),
                endDate: new Date(supply.endDateVal).toISOString()
            });
        }

        return results;
    }

    private hasRequiredSkills(worker: Worker, task: Task): boolean {
        if (!task.requiredSkills || task.requiredSkills.length === 0) return true;
        // Worker must have ALL required skills
        const workerSkills = new Set(worker.skills);
        return task.requiredSkills.every(req => workerSkills.has(req));
    }

    private calculateScore(worker: Worker, task: Task): number {
        let score = 0;
        // Skill Rank Alignment
        // (+Score) when worker's top skill matches task's top requirement
        // Simple heuristic: 
        // For each required skill, where does it sit in worker's list?
        // Higher up = better.

        if (!task.requiredSkills) return 100;

        task.requiredSkills.forEach((reqSkill, reqIndex) => {
            const workerIndex = worker.skills.indexOf(reqSkill);
            // reqIndex 0 is most important. workerIndex 0 is best competence.
            // We want small workerIndex for small reqIndex.

            // Arbitrary scoring: 
            // Base score 10.
            // Penalty for distance from top.
            const competenceScore = Math.max(0, 10 - workerIndex);
            const importanceMultiplier = Math.max(1, 5 - reqIndex);

            score += competenceScore * importanceMultiplier;
        });

        return score;
    }
}
