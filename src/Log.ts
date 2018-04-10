import * as FileSystem from "fs";
import { Config } from "./Config";
import { ILogConfig } from "./api";

/**
 * Log Module
 *
 * @export
 * @class Logger
 */
export class Log {

    public static readonly LOG_ERROR = "error";

    public static readonly LOG_DEBUG = "debug";

    private static instance = new Log();

    private configProvider: Config;

    /**
     *
     * @private
     * @type {Map<string, FileSystem.WriteStream>}
     * @memberof Log
     */
    private streams: Map<string, FileSystem.WriteStream>

    /**
     * Creates an instance of Logger.
     * @memberof Logger
     */
    constructor()
    {
        if (Log.instance) {
            throw new Error("could not create instance of Logger");
        }

        this.streams        = new Map<string, FileSystem.WriteStream>();
        this.configProvider = Config.getInstance();
        Log.instance        = this;
    }

    /**
     * get instance
     *
     * @static
     * @returns {Logger}
     * @memberof Logger
     */
    public static getInstance(): Log
    {
        return Log.instance;
    }

    /**
     * configure logging paths
     * 
     * @memberof Log
     */
    public static configure(config: ILogConfig): void
    {
        Config.getInstance().import(config);
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
    public log(message: any, type: string = Log.LOG_DEBUG): void
    {
        const stream: FileSystem.WriteStream = this.getWriteStream(type);
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
    private createLogMessage(type: string, body: string): string
    {
        let logMessage: string;

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
    private getWriteStream(type): FileSystem.WriteStream
    {
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
    private addLeadingZero(value: string): string
    {
        return value.replace(/^(\d(?!\d))$/, "0$1");
    }
}
