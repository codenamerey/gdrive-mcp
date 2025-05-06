import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import * as FormData from "form-data";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class DriveService {
  private readonly logger = new Logger(DriveService.name);
  private readonly driveServerUrl: string;

  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.driveServerUrl =
      this.configService.get("DRIVE_SERVER_URL") || "http://localhost:3001";
  }

  async listFiles(tokens: any, pageSize?: number, pageToken?: string) {
    try {
      // Validate tokens before making the request
      // const isValid = await this.authService.validateTokens(tokens);
      // if (!isValid) {
      //   throw new Error('Invalid or expired tokens');
      // }

      const response = await axios.get(`${this.driveServerUrl}/drive/files`, {
        headers: {
          "x-auth-tokens": JSON.stringify(tokens),
        },
        params: {
          pageSize,
          pageToken,
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to list files: ${error.message}`);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  async getFile(tokens: any, fileId: string) {
    try {
      // Validate tokens before making the request
      const isValid = await this.authService.validateTokens(tokens);
      if (!isValid) {
        throw new Error("Invalid or expired tokens");
      }

      const response = await axios.get(
        `${this.driveServerUrl}/drive/files/${fileId}`,
        {
          headers: {
            "x-auth-tokens": JSON.stringify(tokens),
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get file: ${error.message}`);
      throw new Error(`Failed to get file: ${error.message}`);
    }
  }

  async createFiles(
    filePaths: string[],
    metadata: any = {},
    tokens?: any
  ) {
    try {
      // Validate tokens before making the request
      const isValid = await this.authService.validateTokens(tokens);
      if (!isValid) {
        throw new Error("Invalid or expired tokens");
      }

      const response = await axios.post(
        `${this.driveServerUrl}/drive/files`,
        {
          filePaths,
          metadata
        },
        {
          headers: {
            "x-auth-tokens": JSON.stringify(tokens),
            "Content-Type": "application/json"
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create files: ${error.message}`);
      throw new Error(`Failed to create files: ${error.message}`);
    }
  }

  async updateFile(
    tokens: any,
    fileId: string,
    file: Buffer,
    fileName: string,
    mimeType: string,
    metadata: any = {}
  ) {
    try {
      // Validate tokens before making the request
      const isValid = await this.authService.validateTokens(tokens);
      if (!isValid) {
        throw new Error("Invalid or expired tokens");
      }

      const formData = new FormData();
      formData.append("file", file, {
        filename: fileName,
        contentType: mimeType,
      });

      // Add metadata
      Object.keys(metadata).forEach((key) => {
        formData.append(key, metadata[key]);
      });

      const response = await axios.put(
        `${this.driveServerUrl}/drive/files/${fileId}`,
        formData,
        {
          headers: {
            "x-auth-tokens": JSON.stringify(tokens),
            ...formData.getHeaders(),
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update file: ${error.message}`);
      throw new Error(`Failed to update file: ${error.message}`);
    }
  }

  async deleteFile(tokens: any, fileId: string) {
    try {
      // Validate tokens before making the request
      const isValid = await this.authService.validateTokens(tokens);
      if (!isValid) {
        throw new Error("Invalid or expired tokens");
      }

      const response = await axios.delete(
        `${this.driveServerUrl}/drive/files/${fileId}`,
        {
          headers: {
            "x-auth-tokens": JSON.stringify(tokens),
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async createFolder(
    folderName: string,
    metadata: any = {},
    tokens?: any
  ) {
    try {
      // Validate tokens before making the request
      const isValid = await this.authService.validateTokens(tokens);
      if (!isValid) {
        throw new Error("Invalid or expired tokens");
      }

      const response = await axios.post(
        `${this.driveServerUrl}/drive/folders`,
        {
          folderName,
          metadata
        },
        {
          headers: {
            "x-auth-tokens": JSON.stringify(tokens),
            "Content-Type": "application/json"
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create folder: ${error.message}`);
      throw new Error(`Failed to create folder: ${error.message}`);
    }
  }

  async moveFiles(
    fileIds: string[],
    destinationFolderId: string,
    tokens?: any
  ) {
    try {
      // Validate tokens before making the request
      const isValid = await this.authService.validateTokens(tokens);
      if (!isValid) {
        throw new Error("Invalid or expired tokens");
      }

      const response = await axios.post(
        `${this.driveServerUrl}/drive/files/move`,
        {
          fileIds,
          destinationFolderId
        },
        {
          headers: {
            "x-auth-tokens": JSON.stringify(tokens),
            "Content-Type": "application/json"
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to move files: ${error.message}`);
      throw new Error(`Failed to move files: ${error.message}`);
    }
  }
}
