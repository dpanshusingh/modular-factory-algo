import express from 'express';

import workerTasksRouter from './routes/workerTasks';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.send('<h1>Modular Factory API</h1><p>Server is up.</p><p>Check <a href="/health">/health</a> or use POST endpoints at <code>/api/v1/worker-tasks/match</code> and <code>/api/v1/worker-tasks/plan</code>.</p>');
});

app.use('/api/v1/worker-tasks', workerTasksRouter);

export default app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
