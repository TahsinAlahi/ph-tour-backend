import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import GracefulShutDown from "./utils/GracefulShutDown.util";

export let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ph-tour");
    server = app.listen(5000, () => {
      console.log("The server is running on port 5000");
    });
    // setup graceful shutdown
    new GracefulShutDown(server);
  } catch (error) {
    console.log(error);
  }
};

startServer();
