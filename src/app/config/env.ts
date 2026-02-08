import dotenv from "dotenv";
dotenv.config();

interface EnvConfigVar {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
}

function loadEnvConfig() {
  const requiredVariables = ["PORT", "DB_URL", "NODE_ENV"] as const;

  requiredVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`${key} is not defined in the environment variables`);
    }
  });

  return {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
  } as EnvConfigVar;
}

export const envConfig = loadEnvConfig();
