"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileSystem = require("fs");
const Config_1 = require("./Config");
/**
 * Log Module
 *
 * @export
 * @class Logger
 */
class Log {
    /**
     * Creates an instance of Logger.
     * @memberof Logger
     */
    constructor() {
        if (Log.instance) {
            throw new Error("could not create instance of Logger");
        }
        this.streams = new Map();
        this.configProvider = Config_1.Config.getInstance();
        Log.instance = this;
    }
    /**
     * get instance
     *
     * @static
     * @returns {Logger}
     * @memberof Logger
     */
    static getInstance() {
        return Log.instance;
    }
    /**
     * configure logging paths
     *
     * @memberof Log
     */
    static configure(config) {
        Config_1.Config.getInstance().import(config);
    }
    /**
     * log an message
     *
     * @param {string} type log type
     * @param {*} body log message
     * @param {string} [path=null] path to write log file
     * @returns {Promise<void>}
     * @memberof Logger
     */
    log(message, type = Log.LOG_DEBUG) {
        const stream = this.getWriteStream(type);
        stream.write(this.createLogMessage(type, message));
    }
    /**
     *
     * @private
     * @param {string} type
     * @param {string} body
     * @returns {string}
     * @memberof Logger
     */
    createLogMessage(type, body) {
        let logMessage;
        const date = new Date();
        // create date string
        const dateString = `
        ${this.addLeadingZero(date.getDate().toString())}.
        ${this.addLeadingZero((date.getMonth() + 1).toString())}.
        ${date.getFullYear()}
        `.replace(/[\r\n\s]/g, "");
        // create time string
        const timeString = `
        ${this.addLeadingZero(date.getHours().toString())}:
        ${this.addLeadingZero(date.getMinutes().toString())}:
        ${this.addLeadingZero(date.getSeconds().toString())}
        `.replace(/[\r\n\s]/g, "");
        logMessage = `
----------------------------------------------------------------------
${dateString} ${timeString}:
${body}`;
        return logMessage;
    }
    /**
     *
     * @private
     * @param {any} type
     * @returns {FileSystem.WriteStream}
     * @memberof Logger
     */
    getWriteStream(type) {
        const fileName = this.configProvider.get(`LogModule.paths.${type}`);
        if (this.streams.has(fileName)) {
            return this.streams.get(fileName);
        }
        const options = {
            defaultEncoding: "utf8",
            flags: "a+"
        };
        const stream = FileSystem.createWriteStream(fileName, options);
        stream.on('close', () => {
            this.streams.delete(name);
        });
        this.streams.set(fileName, stream);
        return stream;
    }
    /**
     * helper function to add leading zero
     *
     * @private
     * @param {string} value
     * @returns {string}
     * @memberof Logger
     */
    addLeadingZero(value) {
        return value.replace(/^(\d(?!\d))$/, "0$1");
    }
}
Log.LOG_ERROR = "error";
Log.LOG_DEBUG = "debug";
Log.instance = new Log();
exports.Log = Log;
