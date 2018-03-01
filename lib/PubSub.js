"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PubSub {
    /**
     * subscribe to an event
     *
     * @static
     * @param {any} event
     * @param {() => void} listener
     * @returns {() => void} unsubscribe
     * @memberof PubSub
     */
    static subscribe(event, listener) {
        if (!this.topics.has(event)) {
            this.topics.set(event, []);
        }
        const topic = this.topics.get(event);
        const index = topic.push(listener) - 1;
        return () => {
            topic.splice(index, 1);
            if (!topic.length) {
                this.topics.delete(event);
            }
        };
    }
    /**
     * publish an event
     *
     * @static
     * @param {any} event
     * @param {any} args
     * @memberof PubSub
     */
    static publish(event, ...args) {
        if (this.topics.has(event)) {
            this.topics.get(event).forEach((listener) => {
                listener.apply(listener, args);
            });
        }
    }
}
/**
 * holds all topics and listeners
 *
 * @private
 * @static
 * @memberof PubSub
 */
PubSub.topics = new Map();
exports.PubSub = PubSub;
