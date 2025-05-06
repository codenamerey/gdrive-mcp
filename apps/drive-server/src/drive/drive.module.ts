import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DriveController } from "./drive.controller";
import { DriveService } from "./drive.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [DriveController],
  providers: [DriveService],
})
export class DriveModule {}
