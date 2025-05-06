import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  getAuthUrl() {
    return { authUrl: this.authService.generateAuthUrl() };
  }

  @Get('google/callback')
  async handleCallback(@Query('code') code: string): Promise<{ tokens: any }> {
    try {
      const tokens = await this.authService.getTokens(code);
      return { tokens };
    } catch (error) {
      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    }
  }
} 