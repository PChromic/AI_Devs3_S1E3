export interface AuthMessage {
  msgID: string;
  text: string;
}

export class MessageHandler {
  constructor(private readonly apiUrl: string) {}

  async sendMessage(message: AuthMessage): Promise<AuthMessage> {
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

      if (message.msgID !== "0" && data.msgID !== message.msgID) {
        throw new Error("Message ID mismatch");
      }

      return data;
    } catch (error: any) {
      throw new Error(`Communication error: ${error.message}`);
    }
  }
}
