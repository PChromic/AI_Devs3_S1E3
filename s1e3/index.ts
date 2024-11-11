import { App } from "./App";

async function main() {
  try {
    console.log("Starting the application...");
    const app = new App();
    await app.run();
    console.log("Application finished successfully");
  } catch (error) {
    console.error("Application failed:", error);
    process.exit(1);
  }
}

main();
