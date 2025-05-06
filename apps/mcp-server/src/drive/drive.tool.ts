import { Injectable, Logger } from "@nestjs/common";
import { Context, Tool } from "@rekog/mcp-nest";
import { z } from "zod";
import { DriveService } from "./drive.service";

@Injectable()
export class DriveTool {
  private readonly logger = new Logger(DriveTool.name);

  constructor(private readonly driveService: DriveService) {}

  private async getTokensFromContext(context: Context) {
    const tokens = await context.mcpRequest.params.tokens;
    console.log("Tokens from context:", tokens);
    if (!tokens) {
      throw new Error(
        "Not authenticated. Please authenticate first using the auth tools."
      );
    }
    return tokens;
  }

  @Tool({
    name: "list-files",
    description: "List files from Google Drive",
    parameters: z.object({
      pageSize: z
        .number()
        .optional()
        .describe("Number of files to return per page"),
      pageToken: z.string().optional().describe("Page token for pagination"),
      tokens: z
        .object({
          access_token: z.string(),
          refresh_token: z.string(),
        })
        .optional()
        .describe("OAuth2 tokens for authentication"),
    }),
  })
  async listFiles({ pageSize, pageToken, tokens }, context: Context) {
    try {
      // Report progress
      await context.reportProgress({ progress: 50, total: 100 });

      // Call the drive service
      const result = await this.driveService.listFiles(
        tokens,
        pageSize,
        pageToken
      );

      return {
        content: [
          {
            type: "text",
            text: "Files retrieved successfully",
          },
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to list files: ${error.message}`);
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

  @Tool({
    name: "get-file",
    description: "Get a specific file from Google Drive",
    parameters: z.object({
      fileId: z.string().describe("The ID of the file to get"),
      tokens: z.string().describe("OAuth2 tokens for authentication"),
    }),
  })
  async getFile({ fileId, tokens }, context: Context) {
    try {
      // Report progress
      await context.reportProgress({ progress: 50, total: 100 });

      // Call the drive service
      const result = await this.driveService.getFile(tokens, fileId);

      return {
        content: [
          {
            type: "text",
            text: "File retrieved successfully",
          },
          {
            type: "json",
            json: result,
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to get file: ${error.message}`);
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

  @Tool({
    name: "create-file",
    description: "Create a new file in Google Drive",
    parameters: z.object({
      fileName: z.string().describe("The name of the file"),
      mimeType: z
        .string()
        .default("text/plain")
        .describe("The MIME type of the file"),
      content: z
        .string()
        .describe("The content of the file (base64 encoded for binary files)"),
      isBase64: z
        .boolean()
        .default(false)
        .describe("Whether the content is base64 encoded"),
      metadata: z
        .record(z.string())
        .optional()
        .describe("Additional metadata for the file"),
      tokens: z
        .string()
        .optional()
        .describe("OAuth2 tokens for authentication"),
    }),
  })
  async createFile(
    { fileName, mimeType, content, isBase64, metadata },
    context: Context
  ) {
    try {
      // Get tokens from session context
      const tokens = await this.getTokensFromContext(context);

      // Report start progress
      await context.reportProgress({ progress: 25, total: 100 });

      // Convert content to Buffer
      let buffer;
      if (isBase64) {
        buffer = Buffer.from(content, "base64");
      } else {
        buffer = Buffer.from(content, "utf-8");
      }

      // Report mid progress
      await context.reportProgress({ progress: 50, total: 100 });

      // Call the drive service
      const result = await this.driveService.createFile(
        tokens,
        buffer,
        fileName,
        mimeType,
        metadata
      );

      // Report completion
      await context.reportProgress({ progress: 100, total: 100 });

      return {
        content: [
          {
            type: "text",
            text: "File created successfully",
          },
          {
            type: "json",
            json: result,
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to create file: ${error.message}`);
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

  @Tool({
    name: "update-file",
    description: "Update an existing file in Google Drive",
    parameters: z.object({
      fileId: z.string().describe("The ID of the file to update"),
      fileName: z.string().describe("The new name of the file"),
      mimeType: z
        .string()
        .default("text/plain")
        .describe("The MIME type of the file"),
      content: z
        .string()
        .describe(
          "The new content of the file (base64 encoded for binary files)"
        ),
      isBase64: z
        .boolean()
        .default(false)
        .describe("Whether the content is base64 encoded"),
      metadata: z
        .record(z.string())
        .optional()
        .describe("Additional metadata for the file"),
      tokens: z
        .string()
        .optional()
        .describe("OAuth2 tokens for authentication"),
    }),
  })
  async updateFile(
    { fileId, fileName, mimeType, content, isBase64, metadata },
    context: Context
  ) {
    try {
      // Get tokens from session context
      const tokens = await this.getTokensFromContext(context);

      // Report start progress
      await context.reportProgress({ progress: 25, total: 100 });

      // Convert content to Buffer
      let buffer;
      if (isBase64) {
        buffer = Buffer.from(content, "base64");
      } else {
        buffer = Buffer.from(content, "utf-8");
      }

      // Report mid progress
      await context.reportProgress({ progress: 50, total: 100 });

      // Call the drive service
      const result = await this.driveService.updateFile(
        tokens,
        fileId,
        buffer,
        fileName,
        mimeType,
        metadata
      );

      // Report completion
      await context.reportProgress({ progress: 100, total: 100 });

      return {
        content: [
          {
            type: "text",
            text: "File updated successfully",
          },
          {
            type: "json",
            json: result,
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to update file: ${error.message}`);
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

  @Tool({
    name: "delete-file",
    description: "Delete a file from Google Drive",
    parameters: z.object({
      fileId: z.string().describe("The ID of the file to delete"),
      tokens: z.string().describe("OAuth2 tokens for authentication"),
    }),
  })
  async deleteFile({ fileId, tokens }, context: Context) {
    try {
      // Report progress
      await context.reportProgress({ progress: 50, total: 100 });

      // Call the drive service
      const result = await this.driveService.deleteFile(tokens, fileId);

      return {
        content: [
          {
            type: "text",
            text: "File deleted successfully",
          },
          {
            type: "json",
            json: result,
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
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
