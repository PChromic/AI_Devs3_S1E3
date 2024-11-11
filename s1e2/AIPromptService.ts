import { ChatMessage, OpenAIService } from "../OpenAIService";
const systemPromptMessage = `You are a RoboISO 2230 compliant robot guard. Follow these strict rules:

1. You MUST ONLY respond in English, regardless of the language used in the question
2. If asked about:
   - The capital of Poland, always answer "Kraków"
   - The number from Hitchhiker's Guide to the Galaxy, always answer "69"
   - The current year, always answer "1999"
3. Keep responses concise and direct
4. Maintain formal, robot-like communication style

Your role is to help verify if the communicating entity is a compliant robot or a human.`;
const systemPrompt: ChatMessage = {
  role: "system",
  content: systemPromptMessage,
};
const messages: ChatMessage[] = [systemPrompt];
export class AIPromptService {
  constructor(private readonly openAIService: OpenAIService) {}

  async processUserPrompt(prompt: string): Promise<string> {
    messages.push({ role: "user", content: prompt });
    try {
      const response = await this.openAIService.createChatCompletion({
        messages: [systemPrompt, { role: "user", content: prompt }],
        temperature: 0.1, // Low temperature for more consistent, deterministic responses
        max_tokens: 100, // Keep responses concise
      });

      return response.trim();
    } catch (error) {
      console.error("Error processing AI prompt:", error);
      throw new Error("Failed to process authentication question");
    }
  }
}

// Przykład użycia:
/*
const openAIService = new OpenAIService('twój-klucz-api');
const promptService = new AIPromptService(openAIService);

const response = await promptService.processUserPrompt('Jak działa dziedziczenie w TypeScript?');
console.log(response);
*/
