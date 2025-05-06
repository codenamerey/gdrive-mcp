import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DriveService {
  private drive;

  constructor(private configService: ConfigService) {
    this.drive = google.drive('v3');
  }

  async setAuthClient(authClient: Auth.OAuth2Client) {
    this.drive = google.drive({
      version: 'v3',
      auth: authClient,
    });
  }

  async listFiles(pageSize = 10, pageToken?: string) {
    try {
      const response = await this.drive.files.list({
        pageSize,
        pageToken,
        fields: 'nextPageToken, files(id, name, mimeType, size, createdTime)',
      });
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to list files', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFile(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size, createdTime',
      });
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to get file', HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException('Failed to create file', HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException('Failed to update file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteFile(fileId: string) {
    try {
      await this.drive.files.delete({
        fileId,
      });
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new HttpException('Failed to delete file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 