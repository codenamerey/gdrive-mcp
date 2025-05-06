/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriveModule = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const drive_controller_1 = __webpack_require__(5);
const drive_service_1 = __webpack_require__(8);
let DriveModule = class DriveModule {
};
exports.DriveModule = DriveModule;
exports.DriveModule = DriveModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
        ],
        controllers: [drive_controller_1.DriveController],
        providers: [drive_service_1.DriveService],
    })
], DriveModule);


/***/ }),
/* 5 */
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriveController = void 0;
const common_1 = __webpack_require__(1);
const platform_express_1 = __webpack_require__(6);
const googleapis_1 = __webpack_require__(7);
const drive_service_1 = __webpack_require__(8);
let DriveController = class DriveController {
    constructor(driveService) {
        this.driveService = driveService;
    }
    async validateAndSetAuth(tokens) {
        try {
            const parsedTokens = JSON.parse(tokens);
            console.log("parsedTokens", parsedTokens);
            const auth = new googleapis_1.Auth.OAuth2Client();
            auth.setCredentials(parsedTokens);
            await this.driveService.setAuthClient(auth);
        }
        catch (error) {
            console.log("Error parsing tokens", error);
            throw new common_1.HttpException("Invalid tokens", common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async listFiles(tokens, pageSize, pageToken) {
        console.log("tokens", tokens);
        await this.validateAndSetAuth(tokens);
        return this.driveService.listFiles(pageSize, pageToken, tokens);
    }
    async getFile(tokens, fileId) {
        await this.validateAndSetAuth(tokens);
        return this.driveService.getFile(fileId, tokens);
    }
    async createFiles(tokens, body) {
        console.log("tokens", tokens);
        await this.validateAndSetAuth(tokens);
        if (!body.filePaths || !Array.isArray(body.filePaths) || body.filePaths.length === 0) {
            throw new common_1.HttpException("No file paths provided", common_1.HttpStatus.BAD_REQUEST);
        }
        return this.driveService.createFiles(body.filePaths, body.metadata, tokens);
    }
    async updateFile(tokens, fileId, file, metadata) {
        await this.validateAndSetAuth(tokens);
        if (!file) {
            throw new common_1.HttpException("No file uploaded", common_1.HttpStatus.BAD_REQUEST);
        }
        return this.driveService.updateFile(fileId, file, metadata, tokens);
    }
    async deleteFile(tokens, fileId) {
        await this.validateAndSetAuth(tokens);
        return this.driveService.deleteFile(fileId, tokens);
    }
    async createFolder(tokens, body) {
        console.log("tokens", tokens);
        await this.validateAndSetAuth(tokens);
        if (!body.folderName) {
            throw new common_1.HttpException("No folder name provided", common_1.HttpStatus.BAD_REQUEST);
        }
        return this.driveService.createFolder(body.folderName, body.metadata, tokens);
    }
    async moveFiles(tokens, body) {
        console.log("tokens", tokens);
        await this.validateAndSetAuth(tokens);
        if (!body.fileIds || !Array.isArray(body.fileIds) || body.fileIds.length === 0) {
            throw new common_1.HttpException("No file IDs provided", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!body.destinationFolderId) {
            throw new common_1.HttpException("No destination folder ID provided", common_1.HttpStatus.BAD_REQUEST);
        }
        return this.driveService.moveFiles(body.fileIds, body.destinationFolderId, tokens);
    }
};
exports.DriveController = DriveController;
__decorate([
    (0, common_1.Get)("files"),
    __param(0, (0, common_1.Headers)("x-auth-tokens")),
    __param(1, (0, common_1.Query)("pageSize")),
    __param(2, (0, common_1.Query)("pageToken")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Get)("files/:fileId"),
    __param(0, (0, common_1.Headers)("x-auth-tokens")),
    __param(1, (0, common_1.Param)("fileId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "getFile", null);
__decorate([
    (0, common_1.Post)("files"),
    __param(0, (0, common_1.Headers)("x-auth-tokens")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "createFiles", null);
__decorate([
    (0, common_1.Put)("files/:fileId"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Headers)("x-auth-tokens")),
    __param(1, (0, common_1.Param)("fileId")),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "updateFile", null);
__decorate([
    (0, common_1.Delete)("files/:fileId"),
    __param(0, (0, common_1.Headers)("x-auth-tokens")),
    __param(1, (0, common_1.Param)("fileId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Post)("folders"),
    __param(0, (0, common_1.Headers)("x-auth-tokens")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "createFolder", null);
__decorate([
    (0, common_1.Post)("files/move"),
    __param(0, (0, common_1.Headers)("x-auth-tokens")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "moveFiles", null);
exports.DriveController = DriveController = __decorate([
    (0, common_1.Controller)("drive"),
    __metadata("design:paramtypes", [typeof (_a = typeof drive_service_1.DriveService !== "undefined" && drive_service_1.DriveService) === "function" ? _a : Object])
], DriveController);


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("googleapis");

/***/ }),
/* 8 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriveService = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const googleapis_1 = __webpack_require__(7);
const stream_1 = __webpack_require__(9);
const fs = __webpack_require__(10);
const path = __webpack_require__(11);
let DriveService = class DriveService {
    constructor(configService) {
        this.configService = configService;
        this.drive = googleapis_1.google.drive("v3");
    }
    bufferToStream(buffer) {
        const stream = new stream_1.Readable();
        stream._read = () => { };
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
    async setAuthClient(authClient) {
        this.drive = googleapis_1.google.drive({
            version: "v3",
            auth: authClient,
        });
    }
    async listFiles(pageSize = 10, pageToken, tokens) {
        try {
            let parsedTokens = JSON.parse(tokens);
            if (typeof parsedTokens === "string") {
                parsedTokens = JSON.parse(parsedTokens);
            }
            console.log("parsedTokens", parsedTokens);
            const auth = new googleapis_1.Auth.OAuth2Client();
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
        }
        catch (error) {
            console.log("error", error);
            throw new common_1.HttpException("Failed to list files", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getFile(fileId, tokens) {
        try {
            if (tokens) {
                let parsedTokens = JSON.parse(tokens);
                if (typeof parsedTokens === "string") {
                    parsedTokens = JSON.parse(parsedTokens);
                }
                const auth = new googleapis_1.Auth.OAuth2Client();
                auth.setCredentials(parsedTokens);
                await this.setAuthClient(auth);
            }
            const response = await this.drive.files.get({
                fileId,
                fields: "id, name, mimeType, size, createdTime",
            });
            return response.data;
        }
        catch (error) {
            console.log("Error getting file:", error);
            throw new common_1.HttpException("Failed to get file", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createFiles(filePaths, metadata = {}, tokens) {
        try {
            if (!Array.isArray(filePaths) || filePaths.length === 0) {
                throw new common_1.HttpException("No file paths provided", common_1.HttpStatus.BAD_REQUEST);
            }
            for (const filePath of filePaths) {
                if (!fs.existsSync(filePath)) {
                    throw new common_1.HttpException(`File not found: ${filePath}`, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            if (tokens) {
                let parsedTokens = JSON.parse(tokens);
                if (typeof parsedTokens === "string") {
                    parsedTokens = JSON.parse(parsedTokens);
                }
                const auth = new googleapis_1.Auth.OAuth2Client();
                auth.setCredentials(parsedTokens);
                await this.setAuthClient(auth);
            }
            const results = [];
            for (const filePath of filePaths) {
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
                    description: metadata === null || metadata === void 0 ? void 0 : metadata.description,
                    mimeType,
                };
                console.log("Request body:", requestBody);
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
        }
        catch (error) {
            console.log("Error creating files:", error);
            console.log("Error details:", {
                message: error.message,
                code: error.code,
                errors: error.errors,
                stack: error.stack
            });
            throw new common_1.HttpException(`Failed to create files: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getMimeType(fileName) {
        const ext = path.extname(fileName).toLowerCase();
        const mimeTypes = {
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
    async updateFile(fileId, file, metadata, tokens) {
        try {
            if (tokens) {
                let parsedTokens = JSON.parse(tokens);
                if (typeof parsedTokens === "string") {
                    parsedTokens = JSON.parse(parsedTokens);
                }
                const auth = new googleapis_1.Auth.OAuth2Client();
                auth.setCredentials(parsedTokens);
                await this.setAuthClient(auth);
            }
            const response = await this.drive.files.update({
                fileId,
                requestBody: Object.assign({ name: file.originalname, mimeType: file.mimetype }, metadata),
                media: {
                    mimeType: file.mimetype,
                    body: file.buffer,
                },
            });
            return response.data;
        }
        catch (error) {
            console.log("Error updating file:", error);
            throw new common_1.HttpException("Failed to update file", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteFile(fileId, tokens) {
        try {
            if (tokens) {
                let parsedTokens = JSON.parse(tokens);
                if (typeof parsedTokens === "string") {
                    parsedTokens = JSON.parse(parsedTokens);
                }
                const auth = new googleapis_1.Auth.OAuth2Client();
                auth.setCredentials(parsedTokens);
                await this.setAuthClient(auth);
            }
            await this.drive.files.delete({
                fileId,
            });
            return { message: "File deleted successfully" };
        }
        catch (error) {
            console.log("Error deleting file:", error);
            throw new common_1.HttpException("Failed to delete file", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createFolder(folderName, metadata = {}, tokens) {
        try {
            if (tokens) {
                let parsedTokens = JSON.parse(tokens);
                if (typeof parsedTokens === "string") {
                    parsedTokens = JSON.parse(parsedTokens);
                }
                const auth = new googleapis_1.Auth.OAuth2Client();
                auth.setCredentials(parsedTokens);
                await this.setAuthClient(auth);
            }
            const requestBody = {
                name: folderName,
                description: metadata === null || metadata === void 0 ? void 0 : metadata.description,
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
        }
        catch (error) {
            console.log("Error creating folder:", error);
            console.log("Error details:", {
                message: error.message,
                code: error.code,
                errors: error.errors,
                stack: error.stack
            });
            throw new common_1.HttpException(`Failed to create folder: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async moveFiles(fileIds, destinationFolderId, tokens) {
        var _a;
        try {
            if (!Array.isArray(fileIds) || fileIds.length === 0) {
                throw new common_1.HttpException("No file IDs provided", common_1.HttpStatus.BAD_REQUEST);
            }
            if (!destinationFolderId) {
                throw new common_1.HttpException("No destination folder ID provided", common_1.HttpStatus.BAD_REQUEST);
            }
            if (tokens) {
                let parsedTokens = JSON.parse(tokens);
                if (typeof parsedTokens === "string") {
                    parsedTokens = JSON.parse(parsedTokens);
                }
                const auth = new googleapis_1.Auth.OAuth2Client();
                auth.setCredentials(parsedTokens);
                await this.setAuthClient(auth);
            }
            const results = [];
            for (const fileId of fileIds) {
                console.log(`Moving file ${fileId} to folder ${destinationFolderId}`);
                const file = await this.drive.files.get({
                    fileId,
                    fields: 'parents'
                });
                const previousParents = ((_a = file.data.parents) === null || _a === void 0 ? void 0 : _a.join(',')) || '';
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
        }
        catch (error) {
            console.log("Error moving files:", error);
            console.log("Error details:", {
                message: error.message,
                code: error.code,
                errors: error.errors,
                stack: error.stack
            });
            throw new common_1.HttpException(`Failed to move files: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DriveService = DriveService;
exports.DriveService = DriveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], DriveService);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("stream");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("path");

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
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const drive_module_1 = __webpack_require__(4);
async function bootstrap() {
    const app = await core_1.NestFactory.create(drive_module_1.DriveModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: configService.get("AUTH_SERVER_URL") || "http://localhost:3000",
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    const port = 3001;
    await app.listen(port);
    console.log(`Drive server is running on port ${port}`);
}
bootstrap();

})();

/******/ })()
;