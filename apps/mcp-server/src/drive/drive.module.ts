import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DriveTool } from './drive.tool';
import { DriveService } from './drive.service';
import { AuthToolModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthToolModule],
  providers: [DriveTool, DriveService],
})
export class DriveToolModule {}