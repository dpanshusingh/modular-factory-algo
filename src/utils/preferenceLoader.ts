import fs from 'fs';
import path from 'path';

export interface WorkerPreferences {
    [workerName: string]: {
        [taskName: string]: number;
    };
}

export function loadWorkerPreferences(filePath: string): WorkerPreferences {
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');

    // Split into lines and handle CRLF
    const lines = fileContent.split(/\r?\n/);

    // Parse Rows manually
    // We assume standard CSV: comma-separated. 
    // Note: If fields contain commas (quoted), this simple split will fail.
    // Based on the file content seen: "RankedSkills" has quoted content like "closeup, drywall"
    // So we need a regex splitter or simple quote awareness.

    // Helper to parse a CSV line
    const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuote = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const records = lines.map(parseLine);

    // 1. Find Header Row (starting with "Name", "RankedSkills")
    const headerRowIndex = records.findIndex(row => row[0] === 'Name' && row[1] === 'RankedSkills');

    if (headerRowIndex === -1) {
        throw new Error('Could not find header row (Name, RankedSkills) in Workers.csv');
    }

    const header = records[headerRowIndex];

    // 2. Identify Task Columns
    const taskColMap: Map<number, string> = new Map();
    for (let i = 2; i < header.length; i++) {
        const colName = header[i];
        // Clean up quotes if any (e.g. "Complete Roof 5/8"" OSB")
        const cleanName = colName.replace(/^"|"$/g, '').replace(/""/g, '"');
        if (cleanName && cleanName.trim().length > 0) {
            taskColMap.set(i, cleanName.trim());
        }
    }

    // 3. Parse Worker Rows
    const preferences: WorkerPreferences = {};

    for (let i = headerRowIndex + 1; i < records.length; i++) {
        const row = records[i];
        if (!row || row.length === 0) continue;

        const name = row[0];
        // Skip empty names
        if (!name || name.trim().length === 0) continue;

        if (!preferences[name]) {
            preferences[name] = {};
        }

        for (const [colIndex, taskName] of taskColMap.entries()) {
            const valStr = row[colIndex];
            let pref = 4; // Default to 4

            if (valStr && valStr.trim().length > 0) {
                const parsed = parseInt(valStr.trim(), 10);
                if (!isNaN(parsed)) {
                    pref = parsed;
                }
            }

            preferences[name][taskName] = pref;
        }
    }

    return preferences;
}
