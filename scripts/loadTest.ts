import axios from 'axios';
import { Worker, Task } from '../src/types';

const BASE_URL = 'http://localhost:3000/api/v1/worker-tasks';

const generateData = () => {
    const workers: Worker[] = [];
    const tasks: Task[] = [];
    const skills = ['Welding', 'Assembly', 'Painting', 'QA', 'Logistics'];

    // 1. Generate 500 Workers
    for (let i = 0; i < 500; i++) {
        workers.push({
            workerId: `W-${i}`,
            skills: [skills[i % skills.length]]
        });
    }

    // 2. Generate 200 Tasks (24 Hour Shift)
    for (let i = 0; i < 200; i++) {
        tasks.push({
            taskId: `T-${i}`,
            minWorkers: 2,
            maxWorkers: 10,
            estimatedTotalLaborHours: Math.floor(Math.random() * 50) + 10, // 10-60 hours
            requiredSkills: [skills[i % skills.length]]
        });
    }

    return { workers, tasks };
};

const runLoadTest = async () => {
    const { workers, tasks } = generateData();

    console.log(`Payload: ${workers.length} Workers, ${tasks.length} Tasks.`);
    console.log("Sending constraints for a full 24-Hour planning window...");

    const startTime = Date.now();

    try {
        const res = await axios.post(`${BASE_URL}/plan`, {
            interval: {
                startTime: "2025-01-01T00:00:00Z",
                endTime: "2025-01-02T00:00:00Z"
            },
            useHistorical: false,
            workers,
            tasks
        });

        const duration = Date.now() - startTime;
        console.log(`\nSUCCESS!`);
        console.log(`Generated ${res.data.items.length} assignment intervals.`);
        console.log(`Time taken: ${duration}ms (${(duration / 1000).toFixed(2)}s)`);

        // Write full result to file
        const fs = require('fs');
        const outputPath = 'load_test_results.json';
        fs.writeFileSync(outputPath, JSON.stringify(res.data, null, 2));
        console.log(`\nFull JSON output written to: ${outputPath}`);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error:", error.message);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }
        } else {
            console.error(error);
        }
    }
};

runLoadTest();
