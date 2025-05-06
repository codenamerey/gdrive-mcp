import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';

@Injectable()
export class AuthService {
  private oauth2Client: Auth.OAuth2Client;
  private readonly logger = new Logger(AuthService.name);

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get('GOOGLE_REDIRECT_URI');

    this.logger.debug(`Client ID: ${clientId}`);
    this.logger.debug(`Redirect URI: ${redirectUri}`);

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing required OAuth configuration');
    }

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );
  }

  generateAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly',
    ];

    const redirectUri = this.configService.get('GOOGLE_REDIRECT_URI');
    this.logger.debug(`Using redirect URI: ${redirectUri}`);

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      redirect_uri: redirectUri,
    });
  }

  async getTokens(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      throw new Error('Failed to get tokens: ' + error.message);
    }
  }

  getOAuthClient() {
    return this.oauth2Client;
  }
} 