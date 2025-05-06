import { Injectable } from "@nestjs/common";
import { Context, Tool } from "@rekog/mcp-nest";
import { z } from "zod";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthTool {
  constructor(private readonly authService: AuthService) {}

  @Tool({
    name: "get-auth-url",
    description: "Get the Google OAuth authorization URL",
    parameters: z.object({}),
  })
  async getAuthUrl(_, context: Context) {
    try {
      const authUrl = await this.authService.getAuthUrl();
      return {
        content: [
          {
            type: "text",
            text: "Please visit the following URL to authorize this application:",
          },
          {
            type: "text",
            text: authUrl,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
      };
    }
  }
}
