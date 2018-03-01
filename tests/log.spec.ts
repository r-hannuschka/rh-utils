import { expect } from "chai";
import * as FileSystem from "fs";
import * as LineReader from "readline";
import { Config, Log, ILogConfig } from "../src";

function createDirectory(parts) {
    let path: string = __dirname;
    parts.forEach((name, index) => {
        path = `${path}/${name}`;
        if ( ! FileSystem.existsSync(path) ) {
            FileSystem.mkdirSync(path);
        }
    });
}

function removeDirectory(parts) {

    let path = __dirname.concat('/', parts.join('/'));

    while ( parts.length ) {
        FileSystem.rmdirSync(path);
        parts.pop();
        path = __dirname.concat('/', parts.join('/'));
    }
}

describe("Log Test", () => {

    let log: Log;

    before(() => {
        log = Log.getInstance();
    });

    describe("test errors", () => {

        it("should throw error if directory not exists", () => {
            expect( () => {
                log.log("some message", Log.LOG_DEBUG, '/var/noLogsForYou');
            }).throws(`/var/noLogsForYou is not an directory`);
        });

        it("should throw if no path is given and configured ", () => {
            expect( () => {
                log.log("some message");
            }).throws(`no configuration value found`);
        });

        it("should throw exception: path could not be empty", () => {

            log.configure({
                directories: { 
                    default: '' 
                }
            });

            expect( () => {
                log.log("some message");
            }).throws(`path could not be empty`);
        });
    });

    describe('Configured: directory for debug log', () => {

        let configProvider: Config = Config.getInstance();

        let logPath  = 'tmp/debug';
        let rootPath = __dirname;
        let path = `${rootPath}/${logPath}`;

        before( () => {
            createDirectory(logPath.split('/'));
            let logConfig: ILogConfig  = {
                directories: {
                    debug: path,
                    error: '',
                    default: ''
                }
            };
            log.configure(logConfig);
        });

        after(() => {
            removeDirectory(logPath.split('/'));
        });

        it("should log into tmp/debug", (done) => {

            const debug = {
                file: __filename,
                type: "debug message"
            };

            log.log(JSON.stringify(debug), Log.LOG_DEBUG, `${path}`);

            const file = FileSystem.statSync(`${path}/${Log.LOG_DEBUG}.log`);
            const lineReader = LineReader.createInterface({
                input: FileSystem.createReadStream(`${path}/${Log.LOG_DEBUG}.log`)
            });

            let written: boolean = false;

            lineReader.on("line", (line: string) => {
                if (line.match(JSON.stringify(debug))) {
                    written = true;
                }
            });

            lineReader.on("close", () => {
                // tslint:disable-next-line:no-unused-expression
                expect(file.isFile()).to.be.true;
                // tslint:disable-next-line:no-unused-expression
                expect(written).to.be.true;
                // remove file now
                FileSystem.unlinkSync(`${path}/${Log.LOG_DEBUG}.log`);
                done();
            });
        });
    });
    
    describe('Configured: directory for error log.', () => {

        let logPath  = 'tmp/error';
        let rootPath = __dirname;
        let path = `${rootPath}/${logPath}`;

        before( () => {
            createDirectory(logPath.split('/'));
            let logConfig: ILogConfig  = {
                directories: {
                    debug: '',
                    error: path,
                    default: ''
                }
            };
            log.configure(logConfig);
        });

        after(() => {
            removeDirectory(logPath.split('/'));
        });

        it("should log into tmp/error", (done) => {

            const debug = {
                file: __filename,
                type: "debug message"
            };

            log.log( JSON.stringify(debug), Log.LOG_ERROR, `${path}`);

            const file = FileSystem.statSync(`${path}/${Log.LOG_ERROR}.log`);
            const lineReader = LineReader.createInterface({
                input: FileSystem.createReadStream(`${path}/${Log.LOG_ERROR}.log`)
            });

            let written: boolean = false;

            lineReader.on("line", (line: string) => {
                if (line.match(JSON.stringify(debug))) {
                    written = true;
                }
            });

            lineReader.on("close", () => {
                // tslint:disable-next-line:no-unused-expression
                expect(file.isFile()).to.be.true;
                // tslint:disable-next-line:no-unused-expression
                expect(written).to.be.true;
                // remove file now
                FileSystem.unlinkSync(`${path}/${Log.LOG_ERROR}.log`);
                done();
            });
        });
    })

    describe('Test Log in custom path', () => {

        let logPath  = 'tmp/logs';
        let rootPath = __dirname;
        let path: string;

        before( () => {
            createDirectory(logPath.split('/'));
            path = `${rootPath}/${logPath}`;
        });

        after(() => {
            removeDirectory(logPath.split('/'));
            path = `${rootPath}`;
        });

        it("should log into tmp/logs/error.log", (done) => {
            const error = {
                file: __filename,
                type: "test error"
            };

            log.log(JSON.stringify(error), Log.LOG_ERROR, `${path}`)
            const file = FileSystem.statSync(`${path}/${Log.LOG_ERROR}.log`);

            const lineReader = LineReader.createInterface({
                input: FileSystem.createReadStream(`${path}/${Log.LOG_ERROR}.log`)
            });

            let written: boolean = false;

            lineReader.on("line", (line: string) => {
                if (line.match(JSON.stringify(error))) {
                    written = true;
                }
            });

            lineReader.on("close", () => {
                // tslint:disable-next-line:no-unused-expression
                expect(file.isFile()).to.be.true;
                // tslint:disable-next-line:no-unused-expression
                expect(written).to.be.true;
                // remove file now
                FileSystem.unlinkSync(`${path}/${Log.LOG_ERROR}.log`);
                done();
            });
        });

        it("should log into tmp/logs/debug.log", (done) => {
            const debug = {
                file: __filename,
                type: "debug message"
            };

            log.log( JSON.stringify(debug), Log.LOG_DEBUG, `${path}`);

            const file = FileSystem.statSync(`${path}/${Log.LOG_DEBUG}.log`);
            const lineReader = LineReader.createInterface({
                input: FileSystem.createReadStream(`${path}/${Log.LOG_DEBUG}.log`)
            });

            let written: boolean = false;

            lineReader.on("line", (line: string) => {
                if (line.match(JSON.stringify(debug))) {
                    written = true;
                }
            });

            lineReader.on("close", () => {
                // tslint:disable-next-line:no-unused-expression
                expect(file.isFile()).to.be.true;
                // tslint:disable-next-line:no-unused-expression
                expect(written).to.be.true;
                // remove file now
                FileSystem.unlinkSync(`${path}/${Log.LOG_DEBUG}.log`);
                done();
            });
        });
    })
});
