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
const drive_module_1 = __webpack_require__(6);
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
exports.DriveToolModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const drive_tool_1 = __webpack_require__(7);
const drive_service_1 = __webpack_require__(9);
const auth_module_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '../auth/auth.module'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
var DriveTool_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriveTool = void 0;
const common_1 = __webpack_require__(3);
const mcp_nest_1 = __webpack_require__(5);
const zod_1 = __webpack_require__(8);
const drive_service_1 = __webpack_require__(9);
const axios_1 = __webpack_require__(10);
let DriveTool = DriveTool_1 = class DriveTool {
    constructor(driveService) {
        this.driveService = driveService;
        this.logger = new common_1.Logger(DriveTool_1.name);
        this.AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';
    }
    async getTokensFromContext(context) {
        try {
            const response = await axios_1.default.get(`${this.AUTH_SERVICE_URL}/auth/tokens`);
            const { access_token, refresh_token } = response.data;
            if (!access_token || !refresh_token) {
                throw new Error("Not authenticated. Please authenticate first using the auth tools.");
            }
            return { access_token, refresh_token };
        }
        catch (error) {
            throw new Error("Not authenticated. Please authenticate first using the auth tools.");
        }
    }
    async listFiles({ pageSize, pageToken }, context) {
        try {
            const tokens = await this.getTokensFromContext(context);
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
    async getFile({ fileId }, context) {
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
    async createFiles({ filePaths, metadata }, context) {
        try {
            const tokens = await this.getTokensFromContext(context);
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
    async updateFile({ fileId, fileName, mimeType, content, isBase64, metadata }, context) {
        try {
            const tokens = await this.getTokensFromContext(context);
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
    async deleteFile({ fileId }, context) {
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
    async deleteFiles({ fileIds }, context) {
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
        }
        catch (error) {
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
    async createFolder({ folderName, metadata }, context) {
        try {
            const tokens = await this.getTokensFromContext(context);
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
    async moveFiles({ fileIds, destinationFolderId }, context) {
        try {
            const tokens = await this.getTokensFromContext(context);
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
    async listFolders({ pageSize, pageToken }, context) {
        try {
            const tokens = await this.getTokensFromContext(context);
            await context.reportProgress({ progress: 50, total: 100 });
            const result = await this.driveService.listFolders(tokens, pageSize, pageToken);
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
        }
        catch (error) {
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
    async queryFiles({ query, fields, pageSize, pageToken }, context) {
        try {
            const tokens = await this.getTokensFromContext(context);
            await context.reportProgress({ progress: 50, total: 100 });
            const result = await this.driveService.queryFiles(tokens, query, fields, pageSize, pageToken);
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
        }
        catch (error) {
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
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "deleteFile", null);
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "delete-files",
        description: "Delete multiple files from Google Drive",
        parameters: zod_1.z.object({
            fileIds: zod_1.z.array(zod_1.z.string()).describe("Array of file IDs to delete"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_g = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "deleteFiles", null);
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
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_h = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "createFolder", null);
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "move-files",
        description: "Move multiple files to a different folder in Google Drive",
        parameters: zod_1.z.object({
            fileIds: zod_1.z.array(zod_1.z.string()).describe("Array of file IDs to move"),
            destinationFolderId: zod_1.z.string().describe("ID of the destination folder"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_j = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "moveFiles", null);
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "list-folders",
        description: "List folders from Google Drive",
        parameters: zod_1.z.object({
            pageSize: zod_1.z
                .number()
                .optional()
                .describe("Number of folders to return per page"),
            pageToken: zod_1.z.string().optional().describe("Page token for pagination"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_k = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "listFolders", null);
__decorate([
    (0, mcp_nest_1.Tool)({
        name: "query-files",
        description: "Query files in Google Drive using Google Drive's query language",
        parameters: zod_1.z.object({
            query: zod_1.z.string().describe("The query string to search for files (e.g., 'mimeType=\"application/vnd.google-apps.folder\"', '\"folderId\" in parents', etc.)"),
            fields: zod_1.z.string().optional().describe("Fields to return in the response (e.g., 'id, name, mimeType, size, createdTime, parents')"),
            pageSize: zod_1.z.number().optional().describe("Number of results to return per page"),
            pageToken: zod_1.z.string().optional().describe("Page token for pagination"),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_l = typeof mcp_nest_1.Context !== "undefined" && mcp_nest_1.Context) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], DriveTool.prototype, "queryFiles", null);
exports.DriveTool = DriveTool = DriveTool_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof drive_service_1.DriveService !== "undefined" && drive_service_1.DriveService) === "function" ? _a : Object])
], DriveTool);


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
var DriveService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriveService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const axios_1 = __webpack_require__(10);
const FormData = __webpack_require__(11);
const auth_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '../auth/auth.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
    async deleteFiles(tokens, fileIds) {
        try {
            const isValid = await this.authService.validateTokens(tokens);
            if (!isValid) {
                throw new Error("Invalid or expired tokens");
            }
            const response = await axios_1.default.delete(`${this.driveServerUrl}/drive/files`, {
                headers: {
                    "x-auth-tokens": JSON.stringify(tokens),
                    "Content-Type": "application/json"
                },
                data: {
                    fileIds
                }
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to delete files: ${error.message}`);
            throw new Error(`Failed to delete files: ${error.message}`);
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
    async listFolders(tokens, pageSize, pageToken) {
        try {
            const response = await axios_1.default.get(`${this.driveServerUrl}/drive/folders`, {
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
            this.logger.error(`Failed to list folders: ${error.message}`);
            throw new Error(`Failed to list folders: ${error.message}`);
        }
    }
    async queryFiles(tokens, query, fields, pageSize, pageToken) {
        try {
            const response = await axios_1.default.get(`${this.driveServerUrl}/drive/query`, {
                headers: {
                    "x-auth-tokens": JSON.stringify(tokens),
                },
                params: {
                    q: query,
                    fields,
                    pageSize,
                    pageToken,
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to query files: ${error.message}`);
            throw new Error(`Failed to query files: ${error.message}`);
        }
    }
};
exports.DriveService = DriveService;
exports.DriveService = DriveService = DriveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], DriveService);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 11 */
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