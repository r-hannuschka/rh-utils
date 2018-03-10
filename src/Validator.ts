import * as request from 'request';
import { IncomingMessage } from 'http';
import { PathLike, readdirSync, statSync, Stats } from 'fs';

export class Validator {

    /**
     * regex to validate given url is valid
     * 
     * @see search for perfect url regex https://mathiasbynens.be/demo/url-regex 
     * @see https://gist.github.com/dperini/729294
     */
    private static REGEX_URL = `
    ^(?:(?:https?|ftp)://)
    (?:\\S+(?::\\S*)?@)?
    (?:
      (?!(?:10|127)(?:\\.\\d{1,3}){3})
      (?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})
      (?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})
      (?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])
      (?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}
      (?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4])) |
      (?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)
      (?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*
      (?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))
      \\.?
    )
    (?::\\d{2,5})?
    (?:[/?#]\\S*)?
    $`;

    /**
     * test given url is valid by regex to check url really exists @see Validator.urlExists
     * 
     * @static
     * @param {string} url 
     * @returns {boolean} 
     * @memberof Validator
     */
    public static isUrl(url: string): boolean
    {
        return new RegExp(Validator.REGEX_URL, 'i').test(url);
    }

    /**
     * send head request to given url to determine url is callable ( exists )
     * 
     * @static
     * @param {string} url 
     * @returns {Promise<boolean>} 
     * @memberof Validator
     */
    public static async urlExists(url: string): Promise<boolean>
    {
        const exists: Promise<boolean> = new Promise( (resolve, reject) => {
            request({ url: url, method: 'HEAD' }, (err, res: IncomingMessage) => {
                if ( err || res.statusCode >= 400 ) {
                    reject(false);
                }
                resolve(true)
            });
        });
        return exists;
    }

    /**
     * validate its an existing directory
     *
     * @param dir
     */
    public static isDirectory(dir: PathLike): boolean {
        const stat: Stats =  statSync(dir);
        return stat.isDirectory();
    }

    /**
     * validate file exists
     * 
     * @param name
     * @param dir
     * @param [ignorePrefix]
     */
    public static fileExists(
        name: string,
        dir: PathLike,
        ignorePrefix: boolean = false
    ) {
        if ( ! Validator.isDirectory(dir) ) {
            throw new Error("no directory");
        }

        return readdirSync(dir).some( (file) => {

            if ( Validator.isDirectory(`${dir}/${file}`) ) {
                return false;
            }

            if ( ! ignorePrefix ) {
                return file === name;
            }

            return file.match(/(.*)\.[^\.]+$/) ? RegExp.$1 === name : false;
        });
    }
}