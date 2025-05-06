/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const mcp_nest_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(6);
const drive_module_1 = __webpack_require__(12);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            mcp_nest_1.McpModule.forRoot({
                name: "google-drive-mcp",
                version: "1.0.0",
                transport: mcp_nest_1.McpTransportType.STDIO,
                instructions: "This is an MCP server for Google Drive integration. Use auth tools to authenticate and then use drive tools to interact with Google Drive.",
            }),
            auth_module_1.AuthToolModule,
            drive_module_1.DriveToolModule,
        ],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@rekog/mcp-nest");

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthToolModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const auth_tool_1 = __webpack_require__(7);
const auth_service_1 = __webpack_require__(9);
let AuthToolModule = class AuthToolModule {
};
exports.AuthToolModule = AuthToolModule;
exports.AuthToolModule = AuthToolModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [auth_tool_1.AuthTool, auth_service_1.AuthService],
        exports: [auth_service_1.AuthService],
    })
], AuthToolModule);


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthTool = void 0;
const common_1 = __webpack_require__(3);
const mcp_nest_1 = __webpack_require__(5);
const zod_1 = __webpack_require__(8);
const auth_service_1 = __webpack_require__(9);
let AuthTool = class AuthTool {
    constructor(authService) {
        this.authService = authService;
    }
    async getAuthUrl(_, context) {
        try {
            const authUrl = await this.authService.getAuthUrl();
            return {
                content: [
                    {
                        type: "text",
                        text: "Please visit the following URL to authorize this application:",
                    },
                    {
                        type: "text",
                        text: authUrl,
                    },
                ],
            };
        }
        catch (error) {
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
};
exports.AuthTool = AuthTool;
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "get-auth-url",
        description: "Get the Google OAuth authorization URL",
        parameters: zod_1.z.object({}),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthTool.prototype, "getAuthUrl", null);
exports.AuthTool = AuthTool = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthTool);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("zod");

/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const googleapis_1 = __webpack_require__(10);
const axios_1 = __webpack_require__(11);
let AuthService = AuthService_1 = class AuthService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.authServerUrl = this.configService.get('AUTH_SERVER_URL') || 'http://localhost:3000';
    }
    async getAuthUrl() {
        try {
            const response = await axios_1.default.get(`${this.authServerUrl}/auth/google`);
            return response.data.authUrl;
        }
        catch (error) {
            this.logger.error(`Failed to get auth URL: ${error.message}`);
            throw new Error('Failed to get auth URL');
        }
    }
    async validateTokens(tokens) {
        try {
            const oauth2Client = new googleapis_1.google.auth.OAuth2();
            oauth2Client.setCredentials(tokens);
            const drive = googleapis_1.google.drive({ version: 'v3', auth: oauth2Client });
            await drive.about.get({ fields: 'user' });
            return true;
        }
        catch (error) {
            this.logger.error(`Token validation failed: ${error.message}`);
            return false;
        }
    }
    createAuthClient(tokens) {
        const oauth2Client = new googleapis_1.google.auth.OAuth2();
        oauth2Client.setCredentials(tokens);
        return oauth2Client;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], AuthService);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("googleapis");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriveToolModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const drive_tool_1 = __webpack_require__(13);
const drive_service_1 = __webpack_require__(14);
const auth_module_1 = __webpack_require__(6);
let DriveToolModule = class DriveToolModule {
};
exports.DriveToolModule = DriveToolModule;
exports.DriveToolModule = DriveToolModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, auth_module_1.AuthToolModule],
        providers: [drive_tool_1.DriveTool, drive_service_1.DriveService],
    })
], DriveToolModule);


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DriveTool_1;
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriveTool = void 0;
const common_1 = __webpack_require__(3);
const mcp_nest_1 = __webpack_require__(5);
const zod_1 = __webpack_require__(8);
const drive_service_1 = __webpack_require__(14);
let DriveTool = DriveTool_1 = class DriveTool {
    constructor(driveService) {
        this.driveService = driveService;
        this.logger = new common_1.Logger(DriveTool_1.name);
    }
    async getTokensFromContext(context) {
        const tokens = await context.mcpRequest.params.tokens;
        console.log("Tokens from context:", tokens);
        if (!tokens) {
            throw new Error("Not authenticated. Please authenticate first using the auth tools.");
        }
        return tokens;
    }
    async listFiles({ pageSize, pageToken, tokens }, context) {
        try {
            await context.reportProgress({ progress: 50, total: 100 });
            const result = await this.driveService.listFiles(tokens, pageSize, pageToken);
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
        }
        catch (error) {
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
    async getFile({ fileId, tokens }, context) {
        try {
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
        }
        catch (error) {
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
    async createFiles({ filePaths, metadata, tokens }, context) {
        try {
            await context.reportProgress({ progress: 50, total: 100 });
            const result = await this.driveService.createFiles(filePaths, metadata, tokens);
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
        }
        catch (error) {
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
    async updateFile({ fileId, fileName, mimeType, content, isBase64, metadata, tokens }, context) {
        try {
            await context.reportProgress({ progress: 50, total: 100 });
            let buffer;
            if (isBase64) {
                buffer = Buffer.from(content, "base64");
            }
            else {
                buffer = Buffer.from(content, "utf-8");
            }
            const result = await this.driveService.updateFile(tokens, fileId, buffer, fileName, mimeType, metadata);
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
        }
        catch (error) {
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
    async deleteFile({ fileId, tokens }, context) {
        try {
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
        }
        catch (error) {
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
    async createFolder({ folderName, metadata, tokens }, context) {
        try {
            await context.reportProgress({ progress: 50, total: 100 });
            const result = await this.driveService.createFolder(folderName, metadata, tokens);
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
        }
        catch (error) {
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
    async moveFiles({ fileIds, destinationFolderId, tokens }, context) {
        try {
            await context.reportProgress({ progress: 50, total: 100 });
            const result = await this.driveService.moveFiles(fileIds, destinationFolderId, tokens);
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
        }
        catch (error) {
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
};
exports.DriveTool = DriveTool;
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "list-files",
        description: "List files from Google Drive",
        parameters: zod_1.z.object({
            pageSize: zod_1.z
                .number()
                .optional()
                .describe("Number of files to return per page"),
            pageToken: zod_1.z.string().optional().describe("Page token for pagination"),
            tokens: zod_1.z
                .object({
                access_token: zod_1.z.string(),
                refresh_token: zod_1.z.string(),
            })
                .optional()
                .describe("OAuth2 tokens for authentication"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "listFiles", null);
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "get-file",
        description: "Get a specific file from Google Drive",
        parameters: zod_1.z.object({
            fileId: zod_1.z.string().describe("The ID of the file to get"),
            tokens: zod_1.z
                .object({
                access_token: zod_1.z.string(),
                refresh_token: zod_1.z.string(),
            })
                .describe("OAuth2 tokens for authentication"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "getFile", null);
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "create-files",
        description: "Create multiple files in Google Drive",
        parameters: zod_1.z.object({
            filePaths: zod_1.z.array(zod_1.z.string()).describe("Array of paths to the files to upload"),
            metadata: zod_1.z
                .record(zod_1.z.string())
                .optional()
                .describe("Additional metadata for the files"),
            tokens: zod_1.z
                .object({
                access_token: zod_1.z.string(),
                refresh_token: zod_1.z.string(),
            })
                .optional()
                .describe("OAuth2 tokens for authentication"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "createFiles", null);
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "update-file",
        description: "Update an existing file in Google Drive",
        parameters: zod_1.z.object({
            fileId: zod_1.z.string().describe("The ID of the file to update"),
            fileName: zod_1.z.string().describe("The new name of the file"),
            mimeType: zod_1.z
                .string()
                .default("text/plain")
                .describe("The MIME type of the file"),
            content: zod_1.z
                .string()
                .describe("The new content of the file (base64 encoded for binary files)"),
            isBase64: zod_1.z
                .boolean()
                .default(false)
                .describe("Whether the content is base64 encoded"),
            metadata: zod_1.z
                .record(zod_1.z.string())
                .optional()
                .describe("Additional metadata for the file"),
            tokens: zod_1.z
                .object({
                access_token: zod_1.z.string(),
                refresh_token: zod_1.z.string(),
            })
                .optional()
                .describe("OAuth2 tokens for authentication"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_e = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "updateFile", null);
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "delete-file",
        description: "Delete a file from Google Drive",
        parameters: zod_1.z.object({
            fileId: zod_1.z.string().describe("The ID of the file to delete"),
            tokens: zod_1.z
                .object({
                access_token: zod_1.z.string(),
                refresh_token: zod_1.z.string(),
            })
                .describe("OAuth2 tokens for authentication"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "deleteFile", null);
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "create-folder",
        description: "Create a new folder in Google Drive",
        parameters: zod_1.z.object({
            folderName: zod_1.z.string().describe("The name of the folder to create"),
            metadata: zod_1.z
                .record(zod_1.z.string())
                .optional()
                .describe("Additional metadata for the folder"),
            tokens: zod_1.z
                .object({
                access_token: zod_1.z.string(),
                refresh_token: zod_1.z.string(),
            })
                .optional()
                .describe("OAuth2 tokens for authentication"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_g = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "createFolder", null);
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "move-files",
        description: "Move multiple files to a different folder in Google Drive",
        parameters: zod_1.z.object({
            fileIds: zod_1.z.array(zod_1.z.string()).describe("Array of file IDs to move"),
            destinationFolderId: zod_1.z.string().describe("ID of the destination folder"),
            tokens: zod_1.z
                .object({
                access_token: zod_1.z.string(),
                refresh_token: zod_1.z.string(),
            })
                .optional()
                .describe("OAuth2 tokens for authentication"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_h = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "moveFiles", null);
exports.DriveTool = DriveTool = DriveTool_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof drive_service_1.DriveService !== "undefined" && drive_service_1.DriveService) === "function" ? _a : Object])
], DriveTool);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DriveService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriveService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const axios_1 = __webpack_require__(11);
const FormData = __webpack_require__(15);
const auth_service_1 = __webpack_require__(9);
let DriveService = DriveService_1 = class DriveService {
    constructor(configService, authService) {
        this.configService = configService;
        this.authService = authService;
        this.logger = new common_1.Logger(DriveService_1.name);
        this.driveServerUrl =
            this.configService.get("DRIVE_SERVER_URL") || "http://localhost:3001";
    }
    async listFiles(tokens, pageSize, pageToken) {
        try {
            const response = await axios_1.default.get(`${this.driveServerUrl}/drive/files`, {
                headers: {
                    "x-auth-tokens": JSON.stringify(tokens),
                },
                params: {
                    pageSize,
                    pageToken,
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to list files: ${error.message}`);
            throw new Error(`Failed to list files: ${error.message}`);
        }
    }
    async getFile(tokens, fileId) {
        try {
            const isValid = await this.authService.validateTokens(tokens);
            if (!isValid) {
                throw new Error("Invalid or expired tokens");
            }
            const response = await axios_1.default.get(`${this.driveServerUrl}/drive/files/${fileId}`, {
                headers: {
                    "x-auth-tokens": JSON.stringify(tokens),
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get file: ${error.message}`);
            throw new Error(`Failed to get file: ${error.message}`);
        }
    }
    async createFiles(filePaths, metadata = {}, tokens) {
        try {
            const isValid = await this.authService.validateTokens(tokens);
            if (!isValid) {
                throw new Error("Invalid or expired tokens");
            }
            const response = await axios_1.default.post(`${this.driveServerUrl}/drive/files`, {
                filePaths,
                metadata
            }, {
                headers: {
                    "x-auth-tokens": JSON.stringify(tokens),
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to create files: ${error.message}`);
            throw new Error(`Failed to create files: ${error.message}`);
        }
    }
    async updateFile(tokens, fileId, file, fileName, mimeType, metadata = {}) {
        try {
            const isValid = await this.authService.validateTokens(tokens);
            if (!isValid) {
                throw new Error("Invalid or expired tokens");
            }
            const formData = new FormData();
            formData.append("file", file, {
                filename: fileName,
                contentType: mimeType,
            });
            Object.keys(metadata).forEach((key) => {
                formData.append(key, metadata[key]);
            });
            const response = await axios_1.default.put(`${this.driveServerUrl}/drive/files/${fileId}`, formData, {
                headers: Object.assign({ "x-auth-tokens": JSON.stringify(tokens) }, formData.getHeaders()),
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to update file: ${error.message}`);
            throw new Error(`Failed to update file: ${error.message}`);
        }
    }
    async deleteFile(tokens, fileId) {
        try {
            const isValid = await this.authService.validateTokens(tokens);
            if (!isValid) {
                throw new Error("Invalid or expired tokens");
            }
            const response = await axios_1.default.delete(`${this.driveServerUrl}/drive/files/${fileId}`, {
                headers: {
                    "x-auth-tokens": JSON.stringify(tokens),
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to delete file: ${error.message}`);
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
    async createFolder(folderName, metadata = {}, tokens) {
        try {
            const isValid = await this.authService.validateTokens(tokens);
            if (!isValid) {
                throw new Error("Invalid or expired tokens");
            }
            const response = await axios_1.default.post(`${this.driveServerUrl}/drive/folders`, {
                folderName,
                metadata
            }, {
                headers: {
                    "x-auth-tokens": JSON.stringify(tokens),
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to create folder: ${error.message}`);
            throw new Error(`Failed to create folder: ${error.message}`);
        }
    }
    async moveFiles(fileIds, destinationFolderId, tokens) {
        try {
            const isValid = await this.authService.validateTokens(tokens);
            if (!isValid) {
                throw new Error("Invalid or expired tokens");
            }
            const response = await axios_1.default.post(`${this.driveServerUrl}/drive/files/move`, {
                fileIds,
                destinationFolderId
            }, {
                headers: {
                    "x-auth-tokens": JSON.stringify(tokens),
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to move files: ${error.message}`);
            throw new Error(`Failed to move files: ${error.message}`);
        }
    }
};
exports.DriveService = DriveService;
exports.DriveService = DriveService = DriveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], DriveService);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("form-data");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
            logger: false,
        });
        app.close();
    }
    catch (error) {
        console.error("Error starting the application:", error);
    }
}
bootstrap();

})();

/******/ })()
;