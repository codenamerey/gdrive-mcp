import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { google } from "googleapis";
import * as path from "path";

@Injectable()
export class AuthService {
  private readonly oauth2Client;
  private readonly TOKENS_FILE = path.join(
    process.cwd(),
    "tokens.csv"
  );

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  generateAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/drive"],
      prompt: "consent",
    });
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    await this.saveTokens(tokens);
    return tokens;
  }

  private async saveTokens(tokens: any) {
    const csvContent = `access_token,refresh_token\n${tokens.access_token},${tokens.refresh_token}`;
    await fs.promises.writeFile(this.TOKENS_FILE, csvContent);
  }

  async getStoredTokens() {
    try {
      const content = await fs.promises.readFile(this.TOKENS_FILE, "utf-8");
      const [header, data] = content.split("\n");
      const [access_token, refresh_token] = data.split(",");
      console.log("access_token", access_token);
      return { access_token, refresh_token };
    } catch (error) {
      return null;
    }
  }
}
