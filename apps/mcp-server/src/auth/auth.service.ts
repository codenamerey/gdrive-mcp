import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authServerUrl: string;

  constructor(private configService: ConfigService) {
    this.authServerUrl = this.configService.get('AUTH_SERVER_URL') || 'http://localhost:3000';
  }

  async getAuthUrl(): Promise<string> {
    try {
      const response = await axios.get(`${this.authServerUrl}/auth/google`);
      return response.data.authUrl;
    } catch (error) {
      this.logger.error(`Failed to get auth URL: ${error.message}`);
      throw new Error('Failed to get auth URL');
    }
  }

  async validateTokens(tokens: any): Promise<boolean> {
    try {
      // Create an OAuth2 client with the tokens
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials(tokens);
      
      // Verify the token by making a simple request
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      await drive.about.get({ fields: 'user' });
      
      return true;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      return false;
    }
  }

  createAuthClient(tokens: any): Auth.OAuth2Client {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(tokens);
    return oauth2Client;
  }
}