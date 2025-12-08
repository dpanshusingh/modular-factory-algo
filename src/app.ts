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
import { moduleCharacteristicsRoutes } from "./routes/moduleCharacteristic.route";
import { moduleProfileRoutes } from "./routes/moduleProfile.route";
import { inspectionAreaRoutes } from "./routes/inspectionArea.route";
import { stationRoutes } from "./routes/station.routes";
import { taskTemplateRoutes } from "./routes/taskTemplate.route";
import { travelerTemplateRoutes } from "./routes/travelerTemplate.route";
import { inspectionItemTemplateRoutes } from "./routes/inspectionItemTemplate.route";
import { travelerTemplateTaskTemplateRoutes } from "./routes/travelTemplateTaskTemplate.route";
import { travelerTemplateInspectionItemTemplateRoutes } from "./routes/travelerTemplateInspectionItemTemplate.route";
import { PtoManagementRoutes } from "./routes/ptoManagement.route";
import { moduleRouter } from "./routes/module.routes";
import { departmentRoutes } from "./routes/department.routes";
import { chatRoutes } from "./routes/chatRoutes";
import { ModuleAttributeRoutes } from "./routes/moduleAttribute.routes";
import { taskTemplateModuleAttributeRoutes } from "./routes/taskTemplateModuleAttribute.routes";
import { moduleProfileModuleAttributeRoutes } from "./routes/moduleProfileModuleAttribute.routes";
import { shiftRoutes } from "./routes/shift.routes";
import { timeStudyRoutes } from "./routes/timeStudy.routes";

const app = express();

// Apply general rate limiting
app.use(generalLimiter);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/public", express.static("public"));
app.use(
  cors({
    origin: ENV.ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
app.use("/api/projects", projectRoutes);
app.use("/api/moduleCharacteristics", moduleCharacteristicsRoutes);
app.use("/api/moduleProfiles", moduleProfileRoutes);
app.use("/api/inspectionArea", inspectionAreaRoutes);
app.use("/api/station", stationRoutes);
app.use("/api/taskTemplate", taskTemplateRoutes);
app.use("/api/travelerTemplate", travelerTemplateRoutes);
app.use("/api/inspectionItemTemplate", inspectionItemTemplateRoutes);
app.use(
  "/api/travelerTemplateTaskTemplate",
  travelerTemplateTaskTemplateRoutes
);
app.use(
  "/api/travelerTemplateInspectionItemTemplate",
  travelerTemplateInspectionItemTemplateRoutes
);
app.use("/api/ptoManagement", PtoManagementRoutes);

app.use("/api/module", moduleRouter);

app.use("/api/departments", departmentRoutes);
app.use("/api/chat", chatRoutes);

app.use("/api/moduleattribute", ModuleAttributeRoutes);

app.use("/api/taskTemplateModuleAttribute", taskTemplateModuleAttributeRoutes);

app.use(
  "/api/moduleProfileModuleAttribute",
  moduleProfileModuleAttributeRoutes
);

app.use("/api/timeStudy", timeStudyRoutes);

app.use("/api/shifts", shiftRoutes);

app.use(errorMiddleware);

export { app };
