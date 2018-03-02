import * as FileSystem from "fs";
import { Config } from "./Config";
import { ILogConfig } from "./api";
import { Sanitize } from "./index";

/**
 * Log Module
 *
 * @export
 * @class Logger
 */
export class Log {

    public static readonly LOG_ERROR = "error";

    public static readonly LOG_DEBUG = "debug";

    public static readonly LOG_DEFAULT = "default";

    private static readonly CONFIG_NAMESPACE_LOG: string = "log";

    private static readonly CONFIG_NAMESPACE_LOG_DIRECTORIES: string = "log.directories";

    private static instance = new Log();

    /**
     *
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private path: string;

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
    constructor() {

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
    public static getInstance(): Log {
        return Log.instance;
    }

    /**
     * configure logging paths
     * 
     * @memberof Log
     */
    public configure(config: ILogConfig): void
    {
        this.configProvider.set(Log.CONFIG_NAMESPACE_LOG, config);
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
    public log(message: any, type: string = Log.LOG_DEBUG, path: string = null): void
    {
        let pathStat = null;
        const logPath = path || this.resolvePath(type);

        try {
            pathStat = FileSystem.statSync( logPath );
        } catch (e) { pathStat = null; }

        if ( ! pathStat || ! pathStat.isDirectory()) {
            throw new Error(`${path || this.path} is not an directory`);
        }

        const stream: FileSystem.WriteStream = this.getWriteStream(type, logPath);
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
    private createLogMessage(type: string, body: string): string {
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
    private getWriteStream(type, path: string = null): FileSystem.WriteStream {

        const name = `${path || this.path}/${type}`;

        if (this.streams.has(name)) {
            return this.streams.get(name);
        }

        const options = {
            defaultEncoding: "utf8",
            flags: "a+"
        };

        const stream = FileSystem.createWriteStream(`${name}.log`, options);
        stream.on('close', () => {
            this.streams.delete(name);
        });

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
    private addLeadingZero(value: string): string {
        return value.replace(/^(\d(?!\d))$/, "0$1");
    }

    private resolvePath(type: string): string {

        if ( ! this.configProvider.has(Log.CONFIG_NAMESPACE_LOG_DIRECTORIES) ) {
            throw new Error(`no configuration value found for: ${type}`);
        }

        const config = this.configProvider.get(Log.CONFIG_NAMESPACE_LOG_DIRECTORIES);

        if ( ! config.hasOwnProperty(type) ) {
            type = Log.LOG_DEFAULT;
        }

        const path = Sanitize.trim(config[type] || '');

        if ( ! path.length ) {
            throw new Error('path could not be empty');
        }

        return path;
    }
}
