import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { McpModule, McpTransportType } from "@rekog/mcp-nest";
import { AuthToolModule } from "./auth/auth.module";
import { DriveToolModule } from "./drive/drive.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    McpModule.forRoot({
      name: "google-drive-mcp",
      version: "1.0.0",
      transport: McpTransportType.STDIO,
      instructions:
        "This is an MCP server for Google Drive integration. Use auth tools to authenticate and then use drive tools to interact with Google Drive.",
    }),
    AuthToolModule,
    DriveToolModule,
  ],
})
export class AppModule {}
