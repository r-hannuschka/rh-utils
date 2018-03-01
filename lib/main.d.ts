///<reference types="typescript" />

interface Subscription {
    unsubscribe: () => {};
}

declare module "rh-utils" {

    export class Observable<T> {

        publish(data: T, topic?: string): void

        subscribe(sub: Function, topic?: string): Subscription;
    }

    export class Log {

        public static readonly LOG_DEBUG: string;

        public static readonly LOG_ERROR: string;

        public static getInstance(): Log;

        public log(type: string, message: string): void;
    }

    export class Sanitize {

        public static sanitizeFileName(name: string): string;
    }
}
