"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Config {
    /**
     * Creates an instance of Config.
     * @memberof Config
     */
    constructor() {
        if (Config.instance) {
            throw new Error(`Could not create Instance from Config. Use Config:getInstance() instead!`);
        }
        this.configData = {};
    }
    /**
     * get Instance
     *
     * @static
     * @returns {Config}
     * @memberof Config
     */
    static getInstance() {
        return Config.instance;
    }
    /**
     * import new config value,
     * this will merge and override existing configurations
     *
     * @param {IDataNode} data
     * @memberof Config
     */
    import(data) {
        this.configData = Object.assign(this.configData, data);
    }
    has(path = '') {
        const route = path.split('.');
        const needle = route.pop();
        try {
            const config = this.resolveNamespace(route);
            return config.hasOwnProperty(needle);
        }
        catch (exception) {
            return false;
        }
    }
    /**
     * get config value by path
     *
     * @param path
     */
    get(path = '') {
        const route = path.split(".");
        const name = route.pop();
        const configData = Object.assign({}, this.resolveNamespace(route));
        return configData[name];
    }
    /**
     * set config value
     *
     * @param {string} property
     * @param {*} data
     * @param {string} [path='']
     * @memberof Config
     */
    set(property, data, override = false, path = '') {
        const ns = property.split('.');
        const name = ns.pop();
        let route = path.length ? path.split(".") : [];
        let config;
        if (ns.length) {
            this.createNamespace(ns, route);
            route = route.concat(ns);
        }
        config = this.resolveNamespace(route);
        if (!config.hasOwnProperty(name) || override) {
            config[name] = data;
        }
    }
    generateNamespace(namespace) {
        this.createNamespace(namespace.split('.'), []);
    }
    /**
     * create namespace and append to existing path
     *
     * @private
     * @param {string[]} source
     * @param {string[]} target
     * @memberof Config
     */
    createNamespace(source, target) {
        let config = this.resolveNamespace(target);
        let path = source.slice();
        let item = path.shift();
        while (item) {
            if (!config.hasOwnProperty(item)) {
                config[item] = {};
            }
            config = config[item];
            item = path.shift();
        }
    }
    /**
     * returns config data by path
     *
     * @private
     * @param {string[]} path
     * @returns {*}
     * @memberof Config
     */
    resolveNamespace(partials) {
        let path = partials.slice();
        let item = path.shift();
        let value = this.configData;
        while (item) {
            if (!value.hasOwnProperty(item) || !util_1.isObject(value[item])) {
                throw new Error("Config Path could not resolved");
            }
            value = value[item];
            item = path.shift();
            continue;
        }
        return value;
    }
}
/**
 * holds Config Instance
 *
 * @private
 * @static
 * @type {Config}
 * @memberof Config
 */
Config.instance = new Config();
exports.Config = Config;
