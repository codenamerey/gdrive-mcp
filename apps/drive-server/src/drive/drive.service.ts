import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Auth, drive_v3, google } from "googleapis";

@Injectable()
export class DriveService {
  private drive: drive_v3.Drive;

  constructor(private configService: ConfigService) {
    this.drive = google.drive("v3");
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

  async getFile(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: "id, name, mimeType, size, createdTime",
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        "Failed to get file",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createFile(file: Express.Multer.File, metadata: any) {
    try {
      const response = await this.drive.files.create({
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
      throw new HttpException(
        "Failed to create file",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateFile(fileId: string, file: Express.Multer.File, metadata: any) {
    try {
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
      throw new HttpException(
        "Failed to update file",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFile(fileId: string) {
    try {
      await this.drive.files.delete({
        fileId,
      });
      return { message: "File deleted successfully" };
    } catch (error) {
      throw new HttpException(
        "Failed to delete file",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
