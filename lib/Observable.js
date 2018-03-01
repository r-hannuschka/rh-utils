"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Observable {
    constructor() {
        this.subscriptions = new Map();
    }
    /**
     * subscribe to object
     *
     * @param {any} subscriber
     * @param {string} [topic='gobal']
     * @returns
     * @memberof Observable
     */
    subscribe(subscriber, topic = 'gobal') {
        if (!this.subscriptions.has(topic)) {
            this.subscriptions.set(topic, new Set());
        }
        let group = this.subscriptions.get(topic);
        group.add(subscriber);
        // return unsubscribe method
        return {
            unsubscribe: () => {
                group.delete(subscriber);
                if (!group.size) {
                    this.subscriptions.delete(topic);
                }
                group = null;
            }
        };
    }
    /**
     * publish data
     *
     * @param {any} data
     */
    publish(data, topic = 'gobal') {
        const subscribers = this.subscriptions.get(topic);
        if (subscribers) {
            subscribers.forEach(notify => {
                notify(data);
            });
        }
    }
}
exports.Observable = Observable;
