/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/drive-server/src/drive/drive.controller.ts":
/*!*********************************************************!*\
  !*** ./apps/drive-server/src/drive/drive.controller.ts ***!
  \*********************************************************/
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriveController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const drive_service_1 = __webpack_require__(/*! ./drive.service */ "./apps/drive-server/src/drive/drive.service.ts");
const googleapis_1 = __webpack_require__(/*! googleapis */ "googleapis");
let DriveController = class DriveController {
    constructor(driveService) {
        this.driveService = driveService;
    }
    async validateAndSetAuth(tokens) {
        try {
            const parsedTokens = JSON.parse(tokens);
            const auth = new googleapis_1.Auth.OAuth2Client();
            auth.setCredentials(parsedTokens);
            await this.driveService.setAuthClient(auth);
        }
        catch (error) {
            throw new common_1.HttpException('Invalid tokens', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async listFiles(tokens, pageSize, pageToken) {
        await this.validateAndSetAuth(tokens);
        return this.driveService.listFiles(pageSize, pageToken);
    }
    async getFile(tokens, fileId) {
        await this.validateAndSetAuth(tokens);
        return this.driveService.getFile(fileId);
    }
    async createFile(tokens, file, metadata) {
        await this.validateAndSetAuth(tokens);
        if (!file) {
            throw new common_1.HttpException('No file uploaded', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.driveService.createFile(file, metadata);
    }
    async updateFile(tokens, fileId, file, metadata) {
        await this.validateAndSetAuth(tokens);
        if (!file) {
            throw new common_1.HttpException('No file uploaded', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.driveService.updateFile(fileId, file, metadata);
    }
    async deleteFile(tokens, fileId) {
        await this.validateAndSetAuth(tokens);
        return this.driveService.deleteFile(fileId);
    }
};
exports.DriveController = DriveController;
__decorate([
    (0, common_1.Get)('files'),
    __param(0, (0, common_1.Headers)('x-auth-tokens')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('pageToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Get)('files/:fileId'),
    __param(0, (0, common_1.Headers)('x-auth-tokens')),
    __param(1, (0, common_1.Param)('fileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "getFile", null);
__decorate([
    (0, common_1.Post)('files'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Headers)('x-auth-tokens')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "createFile", null);
__decorate([
    (0, common_1.Put)('files/:fileId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Headers)('x-auth-tokens')),
    __param(1, (0, common_1.Param)('fileId')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_e = typeof Express !== "undefined" && (_d = Express.Multer) !== void 0 && _d.File) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "updateFile", null);
__decorate([
    (0, common_1.Delete)('files/:fileId'),
    __param(0, (0, common_1.Headers)('x-auth-tokens')),
    __param(1, (0, common_1.Param)('fileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DriveController.prototype, "deleteFile", null);
exports.DriveController = DriveController = __decorate([
    (0, common_1.Controller)('drive'),
    __metadata("design:paramtypes", [typeof (_a = typeof drive_service_1.DriveService !== "undefined" && drive_service_1.DriveService) === "function" ? _a : Object])
], DriveController);


/***/ }),

/***/ "./apps/drive-server/src/drive/drive.module.ts":
/*!*****************************************************!*\
  !*** ./apps/drive-server/src/drive/drive.module.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriveModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const drive_controller_1 = __webpack_require__(/*! ./drive.controller */ "./apps/drive-server/src/drive/drive.controller.ts");
const drive_service_1 = __webpack_require__(/*! ./drive.service */ "./apps/drive-server/src/drive/drive.service.ts");
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

/***/ "./apps/drive-server/src/drive/drive.service.ts":
/*!******************************************************!*\
  !*** ./apps/drive-server/src/drive/drive.service.ts ***!
  \******************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const googleapis_1 = __webpack_require__(/*! googleapis */ "googleapis");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let DriveService = class DriveService {
    constructor(configService) {
        this.configService = configService;
        this.drive = googleapis_1.google.drive('v3');
    }
    async setAuthClient(authClient) {
        this.drive = googleapis_1.google.drive({
            version: 'v3',
            auth: authClient,
        });
    }
    async listFiles(pageSize = 10, pageToken) {
        try {
            const response = await this.drive.files.list({
                pageSize,
                pageToken,
                fields: 'nextPageToken, files(id, name, mimeType, size, createdTime)',
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to list files', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getFile(fileId) {
        try {
            const response = await this.drive.files.get({
                fileId,
                fields: 'id, name, mimeType, size, createdTime',
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get file', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createFile(file, metadata) {
        try {
            const response = await this.drive.files.create({
                requestBody: Object.assign({ name: file.originalname, mimeType: file.mimetype }, metadata),
                media: {
                    mimeType: file.mimetype,
                    body: file.buffer,
                },
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to create file', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateFile(fileId, file, metadata) {
        try {
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
            throw new common_1.HttpException('Failed to update file', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteFile(fileId) {
        try {
            await this.drive.files.delete({
                fileId,
            });
            return { message: 'File deleted successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to delete file', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DriveService = DriveService;
exports.DriveService = DriveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], DriveService);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "googleapis":
/*!*****************************!*\
  !*** external "googleapis" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("googleapis");

/***/ })

/******/ 	});
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
/*!***************************************!*\
  !*** ./apps/drive-server/src/main.ts ***!
  \***************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const drive_module_1 = __webpack_require__(/*! ./drive/drive.module */ "./apps/drive-server/src/drive/drive.module.ts");
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