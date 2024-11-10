import { AIPromptService } from "./AIPromptService";
import { config } from "./config";
import { OpenAIService } from "./OpenAIService";

interface AuthMessage {
  msgID: string;
  text: string;
}

export class RobotAuthProtocol {
  constructor(
    private readonly apiUrl: string = "https://xyz.ag3nts.org/verify"
  ) {}

  async initiateAuth() {
    try {
      // Step 1: Send READY command
      const authCommand: AuthMessage = {
        msgID: "0",
        text: "READY",
      };

      const readyResponse = await this.sendMessage(authCommand);
      // initialize unique ID for this auth session
      authCommand.msgID = readyResponse.msgID;

      const aiPromptService = new AIPromptService(
        new OpenAIService(config.openaiApiKey)
      );
      authCommand.text = await aiPromptService.processUserPrompt(
        readyResponse.text
      );

      // Send question and wait for response
      const answer = await this.sendMessage(authCommand);
      console.log(answer.text);
    } catch (error) {
      console.error("Authorization failed:", error);
      return false;
    }
  }

  private async sendMessage(message: AuthMessage): Promise<AuthMessage> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // // Verify response is in English
      // if (!this.isEnglish(data.text)) {
      //   throw new Error("Non-English response received");
      // }

      // Verify msgID matches
      if (message.msgID !== "0" && data.msgID !== message.msgID) {
        throw new Error("Message ID mismatch");
      }

      return data;
    } catch (error: any) {
      throw new Error(`Communication error: ${error.message}`);
    }
  }
}

// Usage example:
async function runAuthProtocol() {
  const protocol = new RobotAuthProtocol();
  const isAuthorized = await protocol.initiateAuth();
  console.log(`Authorization ${isAuthorized ? "successful" : "failed"}`);
}
