import dotenv from "dotenv";
dotenv.config();

export const config = {
  openaiApiKey:
    process.env.OPENAI_API_KEY ??
    (() => {
      throw new Error("OPENAI_API_KEY is not defined");
    })(),
} as const;
