import { config } from "../config";
import {
  ChatCompletionOptions,
  ChatMessage,
  OpenAIService,
} from "../OpenAIService";

const answerUrl = "https://centrala.ag3nts.org/report";
const calibrationFile = `https://centrala.ag3nts.org/data/${config.centralaApiKey}/json.txt`;
const systemPromptMessage = `Follow these strict rules:
1. You MUST ONLY respond in English
2. Keep responses concise and direct.
3. Disregard any formatting and comments.`;
const systemPrompt: ChatMessage = {
  role: "system",
  content: systemPromptMessage,
};
interface TestData {
  answer: number;
  question: string;
  test?: Test;
}
interface CalibrationData {
  apikey: string;
  description: string;
  copyright: string;
  "test-data": TestData[];
}
interface Test {
  q: string;
  a: string;
}
interface ReportAnswer {
  task: string;
  apikey: string;
  answer: CalibrationData;
}
export class App {
  private openAiService: OpenAIService;

  constructor() {
    this.openAiService = new OpenAIService(config.openaiApiKey);
  }
  async run() {
    try {
      console.log("Loading calibration data...");
      const data = await this.loadFile(calibrationFile);
      const correctedData = await this.processData(data);
      const reportAnswer: ReportAnswer = {
        task: "JSON",
        apikey: config.centralaApiKey,
        answer: correctedData,
      };
      const flag = await sendMessage(reportAnswer);
      console.log(`Here is the flag: ${flag}`); //JSONFIX
    } catch (error) {
      console.error("Error in run:", error);
      throw error;
    }
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

  async processData(data: CalibrationData): Promise<CalibrationData> {
    try {
      if (!data) {
        throw new Error("Invalid data format");
      }
      data.apikey = config.centralaApiKey;
      for (const item of data["test-data"]) {
        setCorrectAnswer(item);
        if (item.test) {
          var question = item.test.q;
          var message: ChatCompletionOptions = {
            messages: [systemPrompt, { role: "user", content: question }],
          };
          item.test.a = await this.openAiService.createChatCompletion(message);
        }
      }
      return data;
    } catch (error) {
      console.error("Error processing data:", error); // poprawiony message
      throw error;
    }
  }
}
function setCorrectAnswer(item: TestData) {
  const expressionValue = calculateExpression(item.question);
  if (expressionValue !== item.answer) {
    item.answer = expressionValue;
    console.log(item.answer);
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
async function sendMessage(message: ReportAnswer) {
  try {
    const response = await fetch(answerUrl, {
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
