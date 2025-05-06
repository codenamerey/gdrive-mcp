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
      tokens: z
        .object({
          access_token: z.string(),
          refresh_token: z.string(),
        })
        .describe("OAuth2 tokens for authentication"),
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
            type: "text",
            text: JSON.stringify(result, null, 2),
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
    name: "create-files",
    description: "Create multiple files in Google Drive",
    parameters: z.object({
      filePaths: z.array(z.string()).describe("Array of paths to the files to upload"),
      metadata: z
        .record(z.string())
        .optional()
        .describe("Additional metadata for the files"),
      tokens: z
        .object({
          access_token: z.string(),
          refresh_token: z.string(),
        })
        .optional()
        .describe("OAuth2 tokens for authentication"),
    }),
  })
  async createFiles(
    { filePaths, metadata, tokens },
    context: Context
  ) {
    try {
      // Report progress
      await context.reportProgress({ progress: 50, total: 100 });

      // Call the drive service
      const result = await this.driveService.createFiles(
        filePaths,
        metadata,
        tokens
      );

      return {
        content: [
          {
            type: "text",
            text: result.message,
          },
          {
            type: "text",
            text: JSON.stringify(result.files, null, 2),
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to create files: ${error.message}`);
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
        .object({
          access_token: z.string(),
          refresh_token: z.string(),
        })
        .optional()
        .describe("OAuth2 tokens for authentication"),
    }),
  })
  async updateFile(
    { fileId, fileName, mimeType, content, isBase64, metadata, tokens },
    context: Context
  ) {
    try {
      // Report progress
      await context.reportProgress({ progress: 50, total: 100 });

      // Convert content to Buffer
      let buffer;
      if (isBase64) {
        buffer = Buffer.from(content, "base64");
      } else {
        buffer = Buffer.from(content, "utf-8");
      }

      // Call the drive service
      const result = await this.driveService.updateFile(
        tokens,
        fileId,
        buffer,
        fileName,
        mimeType,
        metadata
      );

      return {
        content: [
          {
            type: "text",
            text: "File updated successfully",
          },
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
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
      tokens: z
        .object({
          access_token: z.string(),
          refresh_token: z.string(),
        })
        .describe("OAuth2 tokens for authentication"),
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
            type: "text",
            text: JSON.stringify(result, null, 2),
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

  @Tool({
    name: "create-folder",
    description: "Create a new folder in Google Drive",
    parameters: z.object({
      folderName: z.string().describe("The name of the folder to create"),
      metadata: z
        .record(z.string())
        .optional()
        .describe("Additional metadata for the folder"),
      tokens: z
        .object({
          access_token: z.string(),
          refresh_token: z.string(),
        })
        .optional()
        .describe("OAuth2 tokens for authentication"),
    }),
  })
  async createFolder(
    { folderName, metadata, tokens },
    context: Context
  ) {
    try {
      // Report progress
      await context.reportProgress({ progress: 50, total: 100 });

      // Call the drive service
      const result = await this.driveService.createFolder(
        folderName,
        metadata,
        tokens
      );

      return {
        content: [
          {
            type: "text",
            text: "Folder created successfully",
          },
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to create folder: ${error.message}`);
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
    name: "move-files",
    description: "Move multiple files to a different folder in Google Drive",
    parameters: z.object({
      fileIds: z.array(z.string()).describe("Array of file IDs to move"),
      destinationFolderId: z.string().describe("ID of the destination folder"),
      tokens: z
        .object({
          access_token: z.string(),
          refresh_token: z.string(),
        })
        .optional()
        .describe("OAuth2 tokens for authentication"),
    }),
  })
  async moveFiles(
    { fileIds, destinationFolderId, tokens },
    context: Context
  ) {
    try {
      // Report progress
      await context.reportProgress({ progress: 50, total: 100 });

      // Call the drive service
      const result = await this.driveService.moveFiles(
        fileIds,
        destinationFolderId,
        tokens
      );

      return {
        content: [
          {
            type: "text",
            text: result.message,
          },
          {
            type: "text",
            text: JSON.stringify(result.files, null, 2),
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to move files: ${error.message}`);
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
