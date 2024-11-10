import OpenAI from "openai";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async createChatCompletion(options: ChatCompletionOptions): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: options.messages,
        temperature: options.temperature ?? 0.1,
        max_tokens: options.max_tokens ?? 100,
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to get response from OpenAI");
    }
  }
}
