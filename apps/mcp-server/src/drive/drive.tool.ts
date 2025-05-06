import { Injectable, Logger } from "@nestjs/common";
import { Context, Tool } from "@rekog/mcp-nest";
import { z } from "zod";
import { DriveService } from "./drive.service";
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class DriveTool {
  private readonly logger = new Logger(DriveTool.name);
  private readonly AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';

  constructor(private readonly driveService: DriveService) {}

  private async getTokensFromContext(context: Context) {
    try {
      const response = await axios.get(`${this.AUTH_SERVICE_URL}/auth/tokens`);
      const { access_token, refresh_token } = response.data;
      
      if (!access_token || !refresh_token) {
        throw new Error("Not authenticated. Please authenticate first using the auth tools.");
      }
      
      return { access_token, refresh_token };
    } catch (error) {
      throw new Error("Not authenticated. Please authenticate first using the auth tools.");
    }
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
    }),
  })
  async listFiles({ pageSize, pageToken }, context: Context) {
    try {
      const tokens = await this.getTokensFromContext(context);
      await context.reportProgress({ progress: 50, total: 100 });

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
    }),
  })
  async getFile({ fileId }, context: Context) {
    try {
      const tokens = await this.getTokensFromContext(context);
      await context.reportProgress({ progress: 50, total: 100 });

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
    }),
  })
  async createFiles({ filePaths, metadata }, context: Context) {
    try {
      const tokens = await this.getTokensFromContext(context);
      await context.reportProgress({ progress: 50, total: 100 });

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
    }),
  })
  async updateFile(
    { fileId, fileName, mimeType, content, isBase64, metadata },
    context: Context
  ) {
    try {
      const tokens = await this.getTokensFromContext(context);
      await context.reportProgress({ progress: 50, total: 100 });

      let buffer;
      if (isBase64) {
        buffer = Buffer.from(content, "base64");
      } else {
        buffer = Buffer.from(content, "utf-8");
      }

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
    }),
  })
  async deleteFile({ fileId }, context: Context) {
    try {
      const tokens = await this.getTokensFromContext(context);
      await context.reportProgress({ progress: 50, total: 100 });

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
    name: "delete-files",
    description: "Delete multiple files from Google Drive",
    parameters: z.object({
      fileIds: z.array(z.string()).describe("Array of file IDs to delete"),
    }),
  })
  async deleteFiles({ fileIds }, context: Context) {
    try {
      const tokens = await this.getTokensFromContext(context);
      await context.reportProgress({ progress: 50, total: 100 });

      const result = await this.driveService.deleteFiles(tokens, fileIds);

      return {
        content: [
          {
            type: "text",
            text: result.message,
          },
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to delete files: ${error.message}`);
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
    }),
  })
  async createFolder({ folderName, metadata }, context: Context) {
    try {
      const tokens = await this.getTokensFromContext(context);
      await context.reportProgress({ progress: 50, total: 100 });

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
    }),
  })
  async moveFiles({ fileIds, destinationFolderId }, context: Context) {
    try {
      const tokens = await this.getTokensFromContext(context);
      await context.reportProgress({ progress: 50, total: 100 });

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

  @Tool({
    name: "list-folders",
    description: "List folders from Google Drive",
    parameters: z.object({
      pageSize: z
        .number()
        .optional()
        .describe("Number of folders to return per page"),
      pageToken: z.string().optional().describe("Page token for pagination"),
    }),
  })
  async listFolders({ pageSize, pageToken }, context: Context) {
    try {
      const tokens = await this.getTokensFromContext(context);
      await context.reportProgress({ progress: 50, total: 100 });

      const result = await this.driveService.listFolders(
        tokens,
        pageSize,
        pageToken
      );

      return {
        content: [
          {
            type: "text",
            text: "Folders retrieved successfully",
          },
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to list folders: ${error.message}`);
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
    name: "query-files",
    description: "Query files in Google Drive using Google Drive's query language",
    parameters: z.object({
      query: z.string().describe("The query string to search for files (e.g., 'mimeType=\"application/vnd.google-apps.folder\"', '\"folderId\" in parents', etc.)"),
      fields: z.string().optional().describe("Fields to return in the response (e.g., 'id, name, mimeType, size, createdTime, parents')"),
      pageSize: z.number().optional().describe("Number of results to return per page"),
      pageToken: z.string().optional().describe("Page token for pagination"),
    }),
  })
  async queryFiles({ query, fields, pageSize, pageToken }, context: Context) {
    try {
      const tokens = await this.getTokensFromContext(context);
      await context.reportProgress({ progress: 50, total: 100 });

      const result = await this.driveService.queryFiles(
        tokens,
        query,
        fields,
        pageSize,
        pageToken
      );

      return {
        content: [
          {
            type: "text",
            text: "Query executed successfully",
          },
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Failed to query files: ${error.message}`);
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
