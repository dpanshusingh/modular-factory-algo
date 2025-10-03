import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { generalLimiter } from "./middlewares/rateLimiter";
import { userRoutes } from "./routes/userRoutes";
import { employeeRoutes } from "./routes/employeeRoutes";
import { timelogRoutes } from "./routes/timelogRoutes";
import { ENV } from "./config/envConfig";


const app = express();

// Apply general rate limiting
app.use(generalLimiter);

const allowedOrigins = process.env.CORS_ORIGIN.split(",");
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use("/public", express.static("public"));
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! veder-backend is running");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/timelogs", timelogRoutes);

app.use(errorMiddleware);

export { app };