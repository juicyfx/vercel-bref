"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_utils_1 = require("@now/build-utils");
const path_1 = __importDefault(require("path"));
async function getBrefFiles() {
    // Lookup for all files in native folder
    return await build_utils_1.glob('native/**', { cwd: path_1.default.join(__dirname, "..") });
}
exports.getBrefFiles = getBrefFiles;
