import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Auth } from "googleapis";
import { memoryStorage } from "multer";
import { DriveService } from "./drive.service";

@Controller("drive")
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  private async validateAndSetAuth(tokens: string) {
    try {
      const parsedTokens = JSON.parse(tokens);
      console.log("parsedTokens", parsedTokens);
      const auth = new Auth.OAuth2Client();
      auth.setCredentials(parsedTokens);
      await this.driveService.setAuthClient(auth);
    } catch (error) {
      console.log("Error parsing tokens", error);
      throw new HttpException("Invalid tokens", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get("files")
  async listFiles(
    @Headers("x-auth-tokens") tokens: string,
    @Query("pageSize") pageSize?: number,
    @Query("pageToken") pageToken?: string
  ) {
    console.log("tokens", tokens);
    await this.validateAndSetAuth(tokens);
    return this.driveService.listFiles(pageSize, pageToken, tokens);
  }

  @Get("files/:fileId")
  async getFile(
    @Headers("x-auth-tokens") tokens: string,
    @Param("fileId") fileId: string
  ) {
    await this.validateAndSetAuth(tokens);
    return this.driveService.getFile(fileId, tokens);
  }

  @Post("files")
  async createFiles(
    @Headers("x-auth-tokens") tokens: string,
    @Body() body: { filePaths: string[]; metadata?: any }
  ) {
    console.log("tokens", tokens);
    await this.validateAndSetAuth(tokens);
    if (!body.filePaths || !Array.isArray(body.filePaths) || body.filePaths.length === 0) {
      throw new HttpException("No file paths provided", HttpStatus.BAD_REQUEST);
    }
    return this.driveService.createFiles(body.filePaths, body.metadata, tokens);
  }

  @Put("files/:fileId")
  @UseInterceptors(FileInterceptor("file"))
  async updateFile(
    @Headers("x-auth-tokens") tokens: string,
    @Param("fileId") fileId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: any
  ) {
    await this.validateAndSetAuth(tokens);
    if (!file) {
      throw new HttpException("No file uploaded", HttpStatus.BAD_REQUEST);
    }
    return this.driveService.updateFile(fileId, file, metadata, tokens);
  }

  @Delete("files/:fileId")
  async deleteFile(
    @Headers("x-auth-tokens") tokens: string,
    @Param("fileId") fileId: string
  ) {
    await this.validateAndSetAuth(tokens);
    return this.driveService.deleteFile(fileId, tokens);
  }

  @Delete("files")
  async deleteFiles(
    @Headers("x-auth-tokens") tokens: string,
    @Body() body: { fileIds: string[] }
  ) {
    await this.validateAndSetAuth(tokens);
    if (!body.fileIds || !Array.isArray(body.fileIds) || body.fileIds.length === 0) {
      throw new HttpException("No file IDs provided", HttpStatus.BAD_REQUEST);
    }
    return this.driveService.deleteFiles(body.fileIds, tokens);
  }

  @Post("folders")
  async createFolder(
    @Headers("x-auth-tokens") tokens: string,
    @Body() body: { folderName: string; metadata?: any }
  ) {
    console.log("tokens", tokens);
    await this.validateAndSetAuth(tokens);
    if (!body.folderName) {
      throw new HttpException("No folder name provided", HttpStatus.BAD_REQUEST);
    }
    return this.driveService.createFolder(body.folderName, body.metadata, tokens);
  }

  @Post("files/move")
  async moveFiles(
    @Headers("x-auth-tokens") tokens: string,
    @Body() body: { fileIds: string[]; destinationFolderId: string }
  ) {
    console.log("tokens", tokens);
    await this.validateAndSetAuth(tokens);
    if (!body.fileIds || !Array.isArray(body.fileIds) || body.fileIds.length === 0) {
      throw new HttpException("No file IDs provided", HttpStatus.BAD_REQUEST);
    }
    if (!body.destinationFolderId) {
      throw new HttpException("No destination folder ID provided", HttpStatus.BAD_REQUEST);
    }
    return this.driveService.moveFiles(body.fileIds, body.destinationFolderId, tokens);
  }

  @Get("folders")
  async listFolders(
    @Headers("x-auth-tokens") tokens: string,
    @Query("pageSize") pageSize?: number,
    @Query("pageToken") pageToken?: string
  ) {
    await this.validateAndSetAuth(tokens);
    return this.driveService.listFolders(pageSize, pageToken, tokens);
  }

  @Get("query")
  async queryFiles(
    @Headers("x-auth-tokens") tokens: string,
    @Query("q") query: string,
    @Query("fields") fields?: string,
    @Query("pageSize") pageSize?: number,
    @Query("pageToken") pageToken?: string
  ) {
    await this.validateAndSetAuth(tokens);
    if (!query) {
      throw new HttpException("Query parameter 'q' is required", HttpStatus.BAD_REQUEST);
    }
    return this.driveService.queryFiles(query, fields, pageSize, pageToken, tokens);
  }
}
