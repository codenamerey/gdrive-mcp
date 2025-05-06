import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseInterceptors, UploadedFile, HttpException, HttpStatus, Headers } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DriveService } from './drive.service';
import { Auth } from 'googleapis';

@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  private async validateAndSetAuth(tokens: string) {
    try {
      const parsedTokens = JSON.parse(tokens);
      const auth = new Auth.OAuth2Client();
      auth.setCredentials(parsedTokens);
      await this.driveService.setAuthClient(auth);
    } catch (error) {
      throw new HttpException('Invalid tokens', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('files')
  async listFiles(
    @Headers('x-auth-tokens') tokens: string,
    @Query('pageSize') pageSize?: number,
    @Query('pageToken') pageToken?: string,
  ) {
    await this.validateAndSetAuth(tokens);
    return this.driveService.listFiles(pageSize, pageToken);
  }

  @Get('files/:fileId')
  async getFile(
    @Headers('x-auth-tokens') tokens: string,
    @Param('fileId') fileId: string,
  ) {
    await this.validateAndSetAuth(tokens);
    return this.driveService.getFile(fileId);
  }

  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  async createFile(
    @Headers('x-auth-tokens') tokens: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: any,
  ) {
    await this.validateAndSetAuth(tokens);
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    return this.driveService.createFile(file, metadata);
  }

  @Put('files/:fileId')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Headers('x-auth-tokens') tokens: string,
    @Param('fileId') fileId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: any,
  ) {
    await this.validateAndSetAuth(tokens);
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    return this.driveService.updateFile(fileId, file, metadata);
  }

  @Delete('files/:fileId')
  async deleteFile(
    @Headers('x-auth-tokens') tokens: string,
    @Param('fileId') fileId: string,
  ) {
    await this.validateAndSetAuth(tokens);
    return this.driveService.deleteFile(fileId);
  }
} 