import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Create application context instead of an HTTP server

  try {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: false, // Disable default logger to avoid spamming the STDIO channel
    });

    app.close();
  } catch (error) {
    console.error("Error starting the application:", error);
  }

  // The app will stay alive due to the MCP STDIO transport
  // We don't need to explicitly call app.close() as it will be handled automatically
}

// Start the application
bootstrap();
