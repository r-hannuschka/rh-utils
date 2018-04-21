export * from './Config';
export * from './Log';
export * from './Helper';
export * from './Observable';
export * from './PubSub';
export * from './Sanitize';
export * from './Validator';

export * from './api';

import { Log } from "./Log";
import { logConfig } from "./etc/log.config";

Log.configure(logConfig);