import { Server } from "http";
import mongoose from "mongoose";

class GracefulShutDown {
  private server: Server;
  private isShuttingDown: boolean;
  constructor(server: Server) {
    this.server = server;
    this.isShuttingDown = false;

    this.setupSignalHandlers();
    this.setupErrorHandlers();
  }

  // sets up the signals to shutdown the server
  setupSignalHandlers() {
    const signals = ["SIGINT", "SIGTERM", "SIGUSR2"];

    signals.forEach((signal) => {
      process.on(signal, () => this.initShutDown(signal));
    });
  }

  // sets up the errors which will shutdown the server in case of uncaught exceptions
  setupErrorHandlers() {
    process.on("uncaughtException", (err) => {
      console.log("Uncaught exception: ", err);
      this.initShutDown("uncaughtException");
    });

    process.on("unhandledRejection", (err) => {
      console.log("Unhandled rejection: ", err);
      this.initShutDown("unhandledRejection");
    });
  }

  async initShutDown(reason: string) {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log(`Shutting down the server due to ${reason}`);

    try {
      await this.shutDownServer();
      await this.shutDownDatabase();
      await this.shutDownExternalServices();

      console.log("Shutdown complete");
      process.exit(0);
    } catch (error) {
      console.log("Error shutting down the server: ", error);
      process.exit(1);
    }
  }

  async shutDownServer() {
    return await new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) reject(err);
        else resolve("Server shut down successfully");
      });
    });
  }

  async shutDownDatabase() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("Database connection closed");
    }
  }

  async shutDownExternalServices() {
    // shutdown other connection and processes
  }
}

export default GracefulShutDown;
