import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { generalLimiter } from "./middlewares/rateLimiter";
import { userRoutes } from "./routes/userRoutes";
import { employeeRoutes } from "./routes/employeeRoutes";
import { timelogRoutes } from "./routes/timelogRoutes";
import { ENV } from "./config/envConfig";
import { projectRoutes } from "./routes/project.route";
import workerTasksRouter from './routes/workerTasks';
import { chatRoutes } from "./routes/chatRoutes";

const app = express();

// Apply general rate limiting
app.use(generalLimiter);

app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use("/public", express.static("public"));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

import path from "path";

//Routes
app.get("/", (req: Request, res: Response) => {
  // Serve the Web Interface
  res.sendFile(path.resolve("public/index.html"));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/timelogs", timelogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/v1/worker-tasks", workerTasksRouter);
app.use("/api/chat", chatRoutes);

app.use(errorMiddleware);

export { app };
