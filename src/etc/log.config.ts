import * as path from "path";

export const logConfig = {
    LogModule: {
        paths: {
            debug: path.resolve(process.cwd(), './log/debug.log'),
            error: path.resolve(process.cwd(), './log/error.log'),
        }
    }
};
