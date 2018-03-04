"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
class Validator {
    /**
     * test given url is valid by regex to check url really exists @see Validator.urlExists
     *
     * @static
     * @param {string} url
     * @returns {boolean}
     * @memberof Validator
     */
    static isUrl(url) {
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
    static urlExists(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = new Promise((resolve, reject) => {
                request({ url: url, method: 'HEAD' }, (err, res) => {
                    if (err || res.statusCode >= 400) {
                        reject(false);
                    }
                    resolve(true);
                });
            });
            return exists;
        });
    }
}
/**
 * regex to validate given url is valid
 *
 * @see search for perfect url regex https://mathiasbynens.be/demo/url-regex
 * @see https://gist.github.com/dperini/729294
 */
Validator.REGEX_URL = `
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
exports.Validator = Validator;
