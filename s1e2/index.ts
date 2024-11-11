import { RobotAuthProtocol } from "./robot-auth";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  try {
    const protocol = new RobotAuthProtocol();
    const isAuthorized = await protocol.initiateAuth();
    console.log(`Authorization ${isAuthorized ? "successful" : "failed"}`);
  } catch (error) {
    console.error("Error during authorization:", error);
  }
}

main();
