import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Auth, drive_v3, google } from "googleapis";
import { Readable } from "stream";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DriveService {
  private drive: drive_v3.Drive;

  constructor(private configService: ConfigService) {
    this.drive = google.drive("v3");
  }

  private bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream._read = () => {}; // _read is required but you can noop it
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  async setAuthClient(authClient: Auth.OAuth2Client) {
    this.drive = google.drive({
      version: "v3",
      auth: authClient,
    });
  }

  async listFiles(pageSize = 10, pageToken?: string, tokens?: any) {
    try {
      let parsedTokens = JSON.parse(tokens);
      // if parsedTokens is string, convert to Object
      if (typeof parsedTokens === "string") {
        parsedTokens = JSON.parse(parsedTokens);
      }
      console.log("parsedTokens", parsedTokens);
      const auth = new Auth.OAuth2Client();
      auth.setCredentials(parsedTokens);
      await this.setAuthClient(auth);

      console.log("Drive credentials before request:", {
        credentials: auth.credentials,
        accessToken: auth.credentials.access_token,
        tokenType: auth.credentials.token_type,
        expiryDate: auth.credentials.expiry_date,
      });

      const response = await this.drive.files.list({
        pageSize,
        pageToken,
        fields: "nextPageToken, files(id, name, mimeType, size, createdTime)",
      });
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw new HttpException(
        "Failed to list files",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getFile(fileId: string, tokens?: any) {
    try {
      if (tokens) {
        let parsedTokens = JSON.parse(tokens);
        if (typeof parsedTokens === "string") {
          parsedTokens = JSON.parse(parsedTokens);
        }
        const auth = new Auth.OAuth2Client();
        auth.setCredentials(parsedTokens);
        await this.setAuthClient(auth);
      }

      const response = await this.drive.files.get({
        fileId,
        fields: "id, name, mimeType, size, createdTime",
      });
      return response.data;
    } catch (error) {
      console.log("Error getting file:", error);
      throw new HttpException(
        "Failed to get file",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createFiles(filePaths: string[], metadata: any = {}, tokens?: any) {
    try {
      if (!Array.isArray(filePaths) || filePaths.length === 0) {
        throw new HttpException(
          "No file paths provided",
          HttpStatus.BAD_REQUEST
        );
      }

      // Check if all files exist
      for (const filePath of filePaths) {
        if (!fs.existsSync(filePath)) {
          throw new HttpException(
            `File not found: ${filePath}`,
            HttpStatus.BAD_REQUEST
          );
        }
      }

      if (tokens) {
        let parsedTokens = JSON.parse(tokens);
        if (typeof parsedTokens === "string") {
          parsedTokens = JSON.parse(parsedTokens);
        }
        const auth = new Auth.OAuth2Client();
        auth.setCredentials(parsedTokens);
        await this.setAuthClient(auth);
      }

      const results = [];
      for (const filePath of filePaths) {
        // Get file stats
        const stats = fs.statSync(filePath);
        const fileName = path.basename(filePath);
        const mimeType = this.getMimeType(fileName);

        console.log("Creating file with metadata:", metadata);
        console.log("File details:", {
          name: fileName,
          mimeType,
          size: stats.size,
          path: filePath
        });
        
        const requestBody = {
          name: fileName,
          description: metadata?.description,
          mimeType,
        };
        console.log("Request body:", requestBody);

        // Read file and create stream
        const fileBuffer = fs.readFileSync(filePath);
        const media = {
          mimeType,
          body: this.bufferToStream(fileBuffer)
        };
        console.log("Created readable stream from file");

        const response = await this.drive.files.create({
          requestBody,
          media,
          fields: 'id, name, mimeType, size, createdTime',
        });
        
        console.log("Upload response:", response.data);
        results.push(response.data);
      }

      return {
        message: `Successfully uploaded ${results.length} files`,
        files: results
      };
    } catch (error) {
      console.log("Error creating files:", error);
      console.log("Error details:", {
        message: error.message,
        code: error.code,
        errors: error.errors,
        stack: error.stack
      });
      throw new HttpException(
        `Failed to create files: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.mp3': 'audio/mpeg',
      '.mp4': 'video/mp4',
      '.ts': 'application/typescript',
      '.tsx': 'application/typescript',
      '.jsx': 'application/javascript',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  async updateFile(fileId: string, file: Express.Multer.File, metadata: any, tokens?: any) {
    try {
      if (tokens) {
        let parsedTokens = JSON.parse(tokens);
        if (typeof parsedTokens === "string") {
          parsedTokens = JSON.parse(parsedTokens);
        }
        const auth = new Auth.OAuth2Client();
        auth.setCredentials(parsedTokens);
        await this.setAuthClient(auth);
      }

      const response = await this.drive.files.update({
        fileId,
        requestBody: {
          name: file.originalname,
          mimeType: file.mimetype,
          ...metadata,
        },
        media: {
          mimeType: file.mimetype,
          body: file.buffer,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error updating file:", error);
      throw new HttpException(
        "Failed to update file",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFile(fileId: string, tokens?: any) {
    try {
      if (tokens) {
        let parsedTokens = JSON.parse(tokens);
        if (typeof parsedTokens === "string") {
          parsedTokens = JSON.parse(parsedTokens);
        }
        const auth = new Auth.OAuth2Client();
        auth.setCredentials(parsedTokens);
        await this.setAuthClient(auth);
      }

      await this.drive.files.delete({
        fileId,
      });
      return { message: "File deleted successfully" };
    } catch (error) {
      console.log("Error deleting file:", error);
      throw new HttpException(
        "Failed to delete file",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createFolder(folderName: string, metadata: any = {}, tokens?: any) {
    try {
      if (tokens) {
        let parsedTokens = JSON.parse(tokens);
        if (typeof parsedTokens === "string") {
          parsedTokens = JSON.parse(parsedTokens);
        }
        const auth = new Auth.OAuth2Client();
        auth.setCredentials(parsedTokens);
        await this.setAuthClient(auth);
      }

      const requestBody = {
        name: folderName,
        description: metadata?.description,
        mimeType: 'application/vnd.google-apps.folder',
      };

      console.log("Creating folder with metadata:", metadata);
      console.log("Folder details:", {
        name: folderName,
        mimeType: requestBody.mimeType
      });

      const response = await this.drive.files.create({
        requestBody,
        fields: 'id, name, mimeType, createdTime',
      });

      console.log("Folder creation response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error creating folder:", error);
      console.log("Error details:", {
        message: error.message,
        code: error.code,
        errors: error.errors,
        stack: error.stack
      });
      throw new HttpException(
        `Failed to create folder: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async moveFiles(fileIds: string[], destinationFolderId: string, tokens?: any) {
    try {
      if (!Array.isArray(fileIds) || fileIds.length === 0) {
        throw new HttpException(
          "No file IDs provided",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!destinationFolderId) {
        throw new HttpException(
          "No destination folder ID provided",
          HttpStatus.BAD_REQUEST
        );
      }

      if (tokens) {
        let parsedTokens = JSON.parse(tokens);
        if (typeof parsedTokens === "string") {
          parsedTokens = JSON.parse(parsedTokens);
        }
        const auth = new Auth.OAuth2Client();
        auth.setCredentials(parsedTokens);
        await this.setAuthClient(auth);
      }

      const results = [];
      for (const fileId of fileIds) {
        console.log(`Moving file ${fileId} to folder ${destinationFolderId}`);

        // First, get the current parents of the file
        const file = await this.drive.files.get({
          fileId,
          fields: 'parents'
        });

        // Remove from old parents and add to new parent
        const previousParents = file.data.parents?.join(',') || '';
        
        const response = await this.drive.files.update({
          fileId,
          addParents: destinationFolderId,
          removeParents: previousParents,
          fields: 'id, name, mimeType, parents',
        });

        console.log("Move response:", response.data);
        results.push(response.data);
      }

      return {
        message: `Successfully moved ${results.length} files`,
        files: results
      };
    } catch (error) {
      console.log("Error moving files:", error);
      console.log("Error details:", {
        message: error.message,
        code: error.code,
        errors: error.errors,
        stack: error.stack
      });
      throw new HttpException(
        `Failed to move files: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
