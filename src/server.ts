import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ph-tour");
    server = app.listen(5000, () => {
      console.log("The server is running on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.log(
    "Unhandled rejection is detected, shutting down the server.\n" + err,
  );
  if (server) {
    server.close(() => {
      console.log(err);
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(
    "Uncaught exception is detected, shutting down the server.\n" + err,
  );
  if (server) {
    server.close(() => {
      console.log(err);
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM is received");
  if (server) {
    server.close();
    process.exit(0);
  }
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT is received, shutting down the server.");
  if (server) {
    server.close();
    process.exit(0);
  }
  process.exit(0);
});
