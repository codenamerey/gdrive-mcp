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
    return this.driveService.getFile(fileId);
  }

  @Post("files")
  @UseInterceptors(FileInterceptor("file"))
  async createFile(
    @Headers("x-auth-tokens") tokens: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: any
  ) {
    console.log("tokens", tokens);
    await this.validateAndSetAuth(tokens);
    if (!file) {
      throw new HttpException("No file uploaded", HttpStatus.BAD_REQUEST);
    }
    return this.driveService.createFile(file, metadata);
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
    return this.driveService.updateFile(fileId, file, metadata);
  }

  @Delete("files/:fileId")
  async deleteFile(
    @Headers("x-auth-tokens") tokens: string,
    @Param("fileId") fileId: string
  ) {
    await this.validateAndSetAuth(tokens);
    return this.driveService.deleteFile(fileId);
  }
}
