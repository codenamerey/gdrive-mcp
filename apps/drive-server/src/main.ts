import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DriveModule } from "./drive/drive.module";

async function bootstrap() {
  const app = await NestFactory.create(DriveModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get("AUTH_SERVER_URL") || "http://localhost:3000",
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = 3001;
  await app.listen(port);
  console.log(`Drive server is running on port ${port}`);
}

bootstrap();
