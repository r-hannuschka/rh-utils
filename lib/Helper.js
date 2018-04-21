"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helper {
    /**
     * generates an id
     *
     * @static
     * @returns {string}
     * @memberof Helper
     */
    static generateId() {
        return Math.random().toString(32).substr(2);
    }
}
exports.Helper = Helper;
