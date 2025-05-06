import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get("DRIVE_SERVER_URL") || "http://localhost:3001",
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = 3000;
  await app.listen(port);
  console.log(`Auth server is running on port ${port}`);
}

bootstrap();
