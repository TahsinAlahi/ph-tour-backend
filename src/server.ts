import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect("");
    server = app.listen(5000, () => {
      console.log("The server is running on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
