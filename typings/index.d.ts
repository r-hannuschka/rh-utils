declare module "rh-utils" {

    import { PathLike } from "fs";

    export interface IDataNode {
        [key: string]: any
    }

    export interface ILogConfig {
        LogModule: {
            paths?: {
                debug?: string,
                error?: string
            }
        }
    } 

    export interface ISubscription {
        unsubscribe: () => {};
    }

    export interface IObservable {
        subscribe(sub: Function, topic?: string): ISubscription;
    }

    export class Config {
        public static getInstance(): Config;

        public get(key: string): any;

        public has(path: string): boolean;

        public import(source: IDataNode);

        public set(key: string, data: any, path?: string);
   }

    export class Log {

        public static readonly LOG_DEBUG: string;

        public static readonly LOG_ERROR: string;

        public static getInstance(): Log;

        public static configure(config: ILogConfig);

        public log(message: string, type?: string, path?: string): void;
    }

    export class Observable<T> {

        subscribe(sub: Function, topic?: string): ISubscription;

        protected publish(data: T, topic?: string): void
    }

    export class Sanitize {

        public static sanitizeFileName(name: string): string;

        public static trim(value: string): string;
    }

    export class PubSub {

        public static subscribe(event: string, listener: () => {}): () => void;

        public static publish(event: string, [arg1, arg2, ...argn]);
    }

    export class Validator {

        /**
         * test given url is valid by regex to check url really exists @see Validator.urlExists
         * 
         * @static
         * @param {string} url 
         * @returns {boolean} 
         * @memberof Validator
         */
        public static isUrl(url: string): boolean;

        /**
         * send head request to given url to determine url is callable ( exists )
         * 
         * @static
         * @param {string} url 
         * @returns {Promise<boolean>} 
         * @memberof Validator
         */
        public static urlExists(url: string): Promise<boolean>;

        /**
         * validate its an existing directory
         * 
         * @param dir 
         */
        public static isDirectory(dir: PathLike): boolean;

        /**
         * validate file exists
         * 
         * @param name
         * @param dir
         * @param [ignorePrefix]
         */
        public static fileExists( name: string, dir: PathLike, ignorePrefix?: boolean): boolean;
    }
}
