"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sanitize {
    static sanitizeFileName(name) {
        return name
            .replace(/[\s\W]+/g, '_') // replace whitespaces special characters by single underscore
            .replace(/(^_|_$)/, ''); // remove underscore and start and end
    }
    static trim(source) {
        return source.replace(/(^ +| +$)/, '');
    }
}
exports.Sanitize = Sanitize;
