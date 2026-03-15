import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import routeNotFound from "./app/middleware/routeNotFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";

const app = express();

app.use(
  expressSession({ secret: "", resave: false, saveUninitialized: false }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
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
