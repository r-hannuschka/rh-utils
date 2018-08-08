const spawn   = require("child_process").spawn;
const dirname = require("path").dirname;
const resolve = require("path").resolve;

const PUBLISH_MINOR = "minor";
const PUBLISH_ADD   = "fix";
const PUBLISH_MAJOR = "major";
const PUBLISH_BREAK = "break";

let version = "";
let packageVersionNumber;

switch ( process.argv.slice(-1)[0] ) {

    case PUBLISH_MINOR: case PUBLISH_ADD: 
        version = PUBLISH_MINOR; 
        break;
    case PUBLISH_MAJOR: case PUBLISH_BREAK: 
        version = PUBLISH_MAJOR; 
        break;
    default: 
        version = "patch"
}

const npmCommand = resolve(dirname(process.argv[0]), "npm.cmd");

// spawn new child process
const npmVersionProcess = spawn(
    npmCommand,
    ["version", version],
    {
        stdio: "inherit"
    }
);

npmVersionProcess.on("data", (data) => {
    packageVersionNumber = data.toString();
    console.log(packageVersionNumber);
});

npmVersionProcess.on("close", async (exitCode) => {

    if ( exitCode !== 0 ) {
        return;
    }

    console.log(packageVersionNumber);

    try {
        await spawnProcess("git", `push origin ${packageVersionNumber}`);
        await spawnProcess(npmCommand, `publish`);
    } catch ( error ) {
        console.error(error);
        process.exit(1);
    }
});

function spawnProcess(command, ...args) {
    return new Promise((resolve, reject) => {
        spawn(command, args, { stdio: 'inherit'})
            .on("close", (exitCode) => {
                if ( exitCode !== 0 ) {
                    reject();
                } else {
                    resolve();
                }
            })
            .on("error", (e) => reject() );
    });
}
