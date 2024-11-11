import dotenv from "dotenv";
dotenv.config();

export const config = {
  openaiApiKey:
    process.env.OPENAI_API_KEY ??
    (() => {
      throw new Error("OPENAI_API_KEY is not defined");
    })(),
  centralaApiKey:
    process.env.CENTRALA_API_KEY ??
    (() => {
      throw new Error("CENTRALA_API_KEY is not defined");
    })(),
  centralaApiUrl: process.env.CENTRALA_API_URL ?? "",
  robotAuthApiUrl: process.env.ROBOT_AUTH_API_URL ?? "",
} as const;
