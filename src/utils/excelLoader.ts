
import * as XLSX from 'xlsx';
import { Worker, Task } from '../types';

export interface ParsedData {
    workers: Worker[];
    tasks: Task[];
}

export function parseExcelData(buffer: Buffer): ParsedData {
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Parse Workers
    const workersSheet = workbook.Sheets['Workers'];
    const workers: Worker[] = [];
    if (workersSheet) {
        // Dynamic Header Finding
        const range = XLSX.utils.decode_range(workersSheet['!ref'] || "A1:Z100");
        const aoa = XLSX.utils.sheet_to_json(workersSheet, { header: 1, range: 0 }) as any[][];

        let headerRowIndex = -1;
        for (let i = 0; i < aoa.length; i++) {
            if (aoa[i] && aoa[i].includes('Name')) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex > -1) {
            const rows: any[] = XLSX.utils.sheet_to_json(workersSheet, { range: headerRowIndex });

            rows.forEach((row, index) => {
                const name = row['Name'];
                if (!name) return;

                const skillsStr = row['RankedSkills'] || "";
                const skills = skillsStr.split(',').map((s: string) => s.trim()).filter((s: string) => s);

                const preferences: Record<string, number> = {};

                Object.keys(row).forEach(key => {
                    if (key !== 'Name' && key !== 'RankedSkills') {
                        const val = parseInt(row[key]);
                        if (!isNaN(val)) {
                            preferences[key] = val;
                        }
                    }
                });

                workers.push({
                    workerId: `w_${index + 1}`,
                    name: name,
                    skills: skills,
                    preferences: preferences
                });
            });
        }
    }

    // Parse Tasks
    const tasksSheet = workbook.Sheets['Tasks'];
    const tasks: Task[] = [];
    if (tasksSheet) {
        const aoa = XLSX.utils.sheet_to_json(tasksSheet, { header: 1, range: 0 }) as any[][];
        let headerRowIndex = -1;
        for (let i = 0; i < aoa.length; i++) {
            if (aoa[i] && aoa[i].includes('TaskName')) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex > -1) {
            const rows: any[] = XLSX.utils.sheet_to_json(tasksSheet, { range: headerRowIndex });

            rows.forEach((row, index) => {
                const name = row['TaskName'];
                if (!name) return;

                tasks.push({
                    taskId: `t_${index + 1}`,
                    name: name,
                    estimatedTotalLaborHours: Number(row['LaborHoursRemaining']) || 0,
                    estimatedRemainingLaborHours: Number(row['LaborHoursRemaining']) || 0,
                    requiredSkills: row['RequiredSkills'] ? row['RequiredSkills'].split(',').map((s: string) => s.trim()) : [],
                    minWorkers: Number(row['MinWorkers']) || 1,
                    maxWorkers: Number(row['MaxWorkers']) || 1,
                    prerequisiteTaskIds: []
                });
            });

            // Second pass for prerequisites
            const taskNameMap = new Map(tasks.map(t => [t.name, t.taskId]));
            rows.forEach((row, index) => {
                if (row['PrerequisiteTask']) {
                    const prereqName = row['PrerequisiteTask'];
                    const prereqId = taskNameMap.get(prereqName);
                    if (prereqId && tasks[index]) {
                        tasks[index].prerequisiteTaskIds = [prereqId];
                    }
                }
            });
        }
    }

    return { workers, tasks };
}
