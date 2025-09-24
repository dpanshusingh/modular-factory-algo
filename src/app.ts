import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { ENV } from "./config/envConfig";


const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use("/public", express.static("public"));
app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true,
  })
);


//Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! veder-backend is running");
});

app.use(errorMiddleware);

export { app };