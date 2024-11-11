import { AIPromptService } from "./AIPromptService";
import { CentralaHandler, CentralaMessage } from "./CentralaHandler";
import { config } from "../config";
import { AuthMessage, MessageHandler } from "./MessageHandler";
import { OpenAIService } from "./OpenAIService";
export class RobotAuthProtocol {
  private messageHandler: MessageHandler;
  private centralaHandler: CentralaHandler;

  constructor() {
    this.messageHandler = new MessageHandler(config.robotAuthApiUrl);
    this.centralaHandler = new CentralaHandler(config.centralaApiUrl);
  }

  async initiateAuth() {
    try {
      // STEP 1: Start auth session
      const authSession = await this.startAuthSession();
      // STEP 2: Process AI response
      const aiResponse = await this.processAIResponse(authSession);
      // STEP 3: Send message to robot auth API
      const answer = await this.messageHandler.sendMessage(aiResponse);
      console.log(answer.text);
      // STEP 4: Send message to centrala API
      //TODO to nie dziala - centrala zwraca 400
      const centralaResponse = await this.sendMessageToCentrala({
        key: config.centralaApiKey,
        flag: answer.text,
      });
      console.log(centralaResponse.flag);
      return true;
    } catch (error) {
      console.error("Authorization failed:", error);
      return false;
    }
  }

  private async startAuthSession(): Promise<AuthMessage> {
    const authCommand: AuthMessage = {
      msgID: "0",
      text: "READY",
    };
    return await this.messageHandler.sendMessage(authCommand);
  }

  private async sendMessageToCentrala(
    message: CentralaMessage
  ): Promise<CentralaMessage> {
    return await this.centralaHandler.sendMessage(message);
  }

  private async processAIResponse(
    readyResponse: AuthMessage
  ): Promise<AuthMessage> {
    const aiPromptService = new AIPromptService(
      new OpenAIService(config.openaiApiKey)
    );

    return {
      msgID: readyResponse.msgID,
      text: await aiPromptService.processUserPrompt(readyResponse.text),
    };
  }
}
