import * as FileSystem from "fs";
import { Config } from "./Config";

export const LOG_ERROR = "error";
export const LOG_DEBUG = "debug";

/**
 * Log Module
 *
 * @export
 * @class Logger
 */
export class Log {

    public static LOG_ERROR = "error";

    public static LOG_DEBUG = "debug";

    private static instance = new Log();

    /**
     *
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private path: string;

    /**
     *
     * @private
     * @type {Map<string, FileSystem.WriteStream>}
     * @memberof Logger
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

        this.streams = new Map<string, FileSystem.WriteStream>();
        this.path    = Config.getInstance().get('paths.logs.root');
        Log.instance = this;
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
     * log an message
     *
     * @param {string} type log type
     * @param {*} body log message
     * @param {string} [path=null] path to write log file
     * @returns {Promise<void>}
     * @memberof Logger
     */
    public log(type: string, body: any, path: string = null): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            let pathStat = null;
            const logPath = path || this.path;

            try {
                pathStat = FileSystem.statSync( logPath );
            } catch (e) { pathStat = null; }

            if ( ! pathStat || ! pathStat.isDirectory()) {
                throw new Error(`${path || this.path} is not an valid directory`);
            }

            const stream: FileSystem.WriteStream = this.getWriteStream(type, logPath);
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
}
