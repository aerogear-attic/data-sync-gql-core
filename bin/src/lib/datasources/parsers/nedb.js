"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Datastore = require('nedb');
const type = 'InMemory';
function NEDBDatasource(config) {
    let client;
    this.type = type;
    this.connect = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!client) {
            client = new Datastore(config.options);
        }
    });
    this.disconnect = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        client = undefined;
    });
    this.getClient = () => {
        if (!client) {
            throw new Error('Data source is disconnected! Reconnect first');
        }
        return client;
    };
}
exports.NEDBDatasource = NEDBDatasource;
//# sourceMappingURL=nedb.js.map