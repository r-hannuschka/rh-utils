///<reference types="typescript" />

declare module "rh-utils" {

    export interface IDataNode {
        [key: string]: any
    }

    export interface ILogConfig {

        directories: {
            debug?: string,

            error?: string,

            default: string
        }
    } 

    export interface ISubscription {
        unsubscribe: () => {};
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

        public configure(config: ILogConfig): void;

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
}
