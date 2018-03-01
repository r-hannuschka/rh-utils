"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileSystem = require("fs");
const Config_1 = require("./Config");
exports.LOG_ERROR = "error";
exports.LOG_DEBUG = "debug";
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
        this.path = Config_1.Config.getInstance().get('paths.logs.root');
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
     * log an message
     *
     * @param {string} type log type
     * @param {*} body log message
     * @param {string} [path=null] path to write log file
     * @returns {Promise<void>}
     * @memberof Logger
     */
    log(type, body, path = null) {
        return new Promise((resolve, reject) => {
            let pathStat = null;
            const logPath = path || this.path;
            try {
                pathStat = FileSystem.statSync(logPath);
            }
            catch (e) {
                pathStat = null;
            }
            if (!pathStat || !pathStat.isDirectory()) {
                throw new Error(`${path || this.path} is not an valid directory`);
            }
            const stream = this.getWriteStream(type, logPath);
            stream.write(this.createLogMessage(type, body), () => {
                resolve();
            });
            stream.on("error", (err) => {
                throw new Error(err);
            });
        });
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
    getWriteStream(type, path = null) {
        const name = `${path || this.path}/${type}`;
        if (this.streams.has(name)) {
            return this.streams.get(name);
        }
        const options = {
            defaultEncoding: "utf8",
            flags: "a+"
        };
        const stream = FileSystem.createWriteStream(`${name}.log`, options);
        this.streams.set(name, stream);
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
