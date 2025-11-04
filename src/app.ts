import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { generalLimiter } from "./middlewares/rateLimiter";
import { userRoutes } from "./routes/userRoutes";
import { employeeRoutes } from "./routes/employeeRoutes";
import { timelogRoutes } from "./routes/timelogRoutes";
import { ENV } from "./config/envConfig";
import { projectRoutes } from "./routes/projectRoute";


const app = express();

// Apply general rate limiting
app.use(generalLimiter);

app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use("/public", express.static("public"));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! veder-backend is running v1");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/timelogs", timelogRoutes);
app.use("/api/projects",projectRoutes)

app.use(errorMiddleware);

export { app };