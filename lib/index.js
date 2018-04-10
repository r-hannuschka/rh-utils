"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./Config"));
__export(require("./Log"));
__export(require("./Observable"));
__export(require("./PubSub"));
__export(require("./Sanitize"));
__export(require("./Validator"));
const Log_1 = require("./Log");
const log_config_1 = require("./etc/log.config");
Log_1.Log.configure(log_config_1.logConfig);
