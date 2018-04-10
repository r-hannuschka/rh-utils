"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.logConfig = {
    LogModule: {
        paths: {
            debug: path.resolve(process.cwd(), './log/debug.log'),
            error: path.resolve(process.cwd(), './log/error.log'),
        }
    }
};
