import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import GracefulShutDown from "./app/utils/GracefulShutDown";
import { envConfig } from "./app/config/env";

export let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envConfig.DB_URL);
    server = app.listen(envConfig.PORT, () => {
      console.log(`The server is running on port ${envConfig.PORT}`);
    });
    // setup graceful shutdown
    new GracefulShutDown(server);
  } catch (error) {
    console.log(error);
  }
};

startServer();
