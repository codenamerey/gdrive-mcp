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
  async handleCallback(@Query('code') code: string, @Res() res: Response): Promise<void> {
    try {
      const tokens = await this.authService.getTokens(code);
      
      res.send(`
        <html>
          <body>
            <h1>Authentication Successful!</h1>
            <p>You can now return to your AI Agent</p>
          </body>
        </html>
      `);
    } catch (error) {
      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('tokens')
  async getTokens() {
    const tokens = await this.authService.getStoredTokens();
    if (!tokens) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }
    return tokens;
  }
} 