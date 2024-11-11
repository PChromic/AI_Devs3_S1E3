import { CentralaHandler } from "../common/CentralaHandler";
import { config } from "../config";

const answerUrl = "https://centrala.ag3nts.org/report";
const calibrationFile = `https://centrala.ag3nts.org/data/${config.centralaApiKey}/json.txt`;
const flag = "";
const centralaHandler = new CentralaHandler(answerUrl);

export class App {
  private centralaHandler: CentralaHandler;

  constructor() {
    this.centralaHandler = new CentralaHandler(answerUrl);
  }

  async loadFile(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error loading file:", error);
      throw error;
    }
  }

  private processData(data: any): string {
    // Tu dodaj logikę przetwarzania danych i generowania flagi
    // Na razie zwracamy pustą flagę
    return "";
  }

  async run() {
    try {
      console.log("Loading calibration data...");
      const data = await this.loadFile(calibrationFile);
      const flag = this.processData(data);
      //   console.log("Sending flag to centrala...");

      //   const response = await this.centralaHandler.sendMessage({
      //     key: config.centralaApiKey,
      //     flag: flag,
      //   });

      //   console.log("Response from centrala:", response);
      //   return response;
    } catch (error) {
      console.error("Error in run:", error);
      throw error;
    }
  }
}
