import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthTool } from './auth.tool';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule],
  providers: [AuthTool, AuthService],
  exports: [AuthService],
})
export class AuthToolModule {}