export interface CentralaMessage {
  key: string;
  flag: string;
}

export class CentralaHandler {
  constructor(private readonly apiUrl: string) {}

  async sendMessage(message: CentralaMessage): Promise<CentralaMessage> {
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

      return data;
    } catch (error: any) {
      throw new Error(`Communication error: ${error.message}`);
    }
  }
}
