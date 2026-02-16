import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import routeNotFound from "./app/middleware/routeNotFound";
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to tour management backend",
  });
});

app.use(globalErrorHandler);
app.use(routeNotFound);

export default app;
