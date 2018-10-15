"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const { Pool } = require('pg');
const { log } = require('../../util/logger');
const type = 'Postgres';
function PostgresDataSource(config) {
    let pool;
    this.type = type;
    this.connect = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!pool) {
            pool = new Pool(config.options);
            pool.on('error', err => {
                log.warn('Postgres connection error. Will try to reconnect with the next request');
                log.warn('Error: ' + err.message);
            });
        }
    });
    this.disconnect = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield pool.end();
        pool = undefined;
    });
    this.getClient = () => {
        if (!pool) {
            throw new Error('Data source is disconnected! Reconnect first');
        }
        return pool;
    };
}
exports.PostgresDataSource = PostgresDataSource;
//# sourceMappingURL=postgres.js.map