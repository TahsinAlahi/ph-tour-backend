import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import GracefulShutDown from "./app/utils/GracefulShutDown";
import { envVars } from "./app/config/env";

export let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    server = app.listen(envVars.PORT, () => {
      console.log(`The server is running on port ${envVars.PORT}`);
    });
    // setup graceful shutdown
    new GracefulShutDown(server);
  } catch (error) {
    console.log(error);
  }
};

startServer();
