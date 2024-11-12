import { CentralaHandler } from "../common/CentralaHandler";
import { config } from "../config";

const answerUrl = "https://centrala.ag3nts.org/report";
const calibrationFile = `https://centrala.ag3nts.org/data/${config.centralaApiKey}/json.txt`;
const flag = "";
const centralaHandler = new CentralaHandler(answerUrl);

interface Calculation {
  answer: number;
  question: string;
}
interface CalibrationData {
  apiKey: string;
  description: string;
  copyright: string;
  "test-data": Calculation[];
}

export class App {
  private centralaHandler: CentralaHandler;

  constructor() {
    this.centralaHandler = new CentralaHandler(answerUrl);
  }

  async loadFile(url: string): Promise<CalibrationData> {
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

  async processData(data: any) {
    try {
      console.log("Starting processData"); // debug log
      if (!data || !data["test-data"]) {
        throw new Error("Invalid data format");
      }

      for (const item of data["test-data"]) {
        const expressionValue = calculateExpression(item.question);
        if (expressionValue !== item.answer) {
          item.answer = expressionValue;
        }
      }
      console.log("Finished processData"); // debug log
      return true; // lub inną wartość zamiast pustego stringa
    } catch (error) {
      console.error("Error processing data:", error); // poprawiony message
      throw error;
    }
  }

  async run() {
    try {
      console.log("Loading calibration data...");
      const data = this.loadFile(calibrationFile);
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

function calculateExpression(expression: string): number {
  // Usuń spacje i podziel na części
  const cleanExpression = expression.replace(/\s+/g, "");

  // Użyj eval() do obliczenia wyniku
  // return eval(cleanExpression);

  // Bezpieczniejsza alternatywa dla eval():
  const [num1, operator, num2] =
    cleanExpression.match(/(\d+)([+\-*/])(\d+)/)?.slice(1) ?? [];

  if (!num1 || !operator || !num2) {
    throw new Error("Invalid expression format");
  }

  switch (operator) {
    case "+":
      return parseInt(num1) + parseInt(num2);
    case "-":
      return parseInt(num1) - parseInt(num2);
    case "*":
      return parseInt(num1) * parseInt(num2);
    case "/":
      return parseInt(num1) / parseInt(num2);
    default:
      throw new Error("Nieobsługiwany operator");
  }
}
