import { isObject } from "util";

export class Config
{
    /**
     * holds Config Instance
     * 
     * @private
     * @static
     * @type {Config}
     * @memberof Config
     */
    private static instance: Config = new Config();

    /**
     * config data object
     * 
     * @private
     * @type {Object}
     * @memberof Config
     */
    private configData: Object;

    /**
     * Creates an instance of Config.
     * @memberof Config
     */
    public constructor() {

        if ( Config.instance ) {
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
    public static getInstance(): Config 
    {
        return Config.instance;
    }

    /**
     * import new config value,
     * this will override all existing configurations
     * 
     * @param {Object} data 
     * @memberof Config
     */
    public import(data: Object) {
        this.configData = data;
    }
    
    public has(path: string = ''): boolean
    {
        const route  = path.split('.');
        const needle = route.pop();

        try {
            const config = this.resolveNamespace(route);
            return config.hasOwnProperty(needle);
        } catch ( exception ) {
            return false;
        }
    }

    /**
     * get config value by path
     * 
     * @param path 
     */
    public get(path: string = ''): any {

        const route = path.split(".");
        const name  = route.pop();
        const configData = Object.assign(
            {}, this.resolveNamespace(route));

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
    public set(property: string, data: any, path: string = '') {

        const ns: string[] = property.split('.'); 
        const name = ns.pop();

        let route: string[] = path.split(".");
        let config: Object;

        if ( ns.length ) {
            this.createNamespace(ns, route);
            route = route.concat(ns);
        }

        config = this.resolveNamespace(route);
        if ( ! config.hasOwnProperty(name) ) {
            config[name] = data;
        }
    }

    /**
     * create namespace and append to existing path
     * 
     * @private
     * @param {string[]} source 
     * @param {string[]} target 
     * @memberof Config
     */
    private createNamespace(source: string[], target: string[])
    {
        let config         = this.resolveNamespace(target);
        let path: string[] = source.slice(); 
        let item: string   = path.shift();

        while ( item ) {
            if ( ! config.hasOwnProperty(item) ) {
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
    private resolveNamespace(partials: string[]): any {

        let path: string[] = partials.slice(); 
        let item: string   = path.shift();
        let value          = this.configData;

        while ( item ) {

            if ( ! value.hasOwnProperty(item) || ! isObject(value[item]) ) {
                throw new Error("Config Path could not resolved");
            }

            value = value[item];
            item = path.shift();
            continue;
        }

        return value;
    }
}