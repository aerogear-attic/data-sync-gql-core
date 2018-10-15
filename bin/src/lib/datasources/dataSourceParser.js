"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { forEach } = require('lodash');
const parsers = require('./parsers');
function default_1(dataSourceDefs, connect = true) {
    let dataSources = {};
    forEach(dataSourceDefs, (dataSourceDef) => {
        let Parser = parsers[dataSourceDef.type];
        const dataSourceName = dataSourceDef.name;
        if (!Parser) {
            throw new Error(`Unhandled data source type: ${dataSourceDef.type}`);
        }
        if (typeof Parser !== 'function') {
            throw new Error(`Data source parser for ${dataSourceDef.type} is missing a constructor`);
        }
        const dataSourceObj = new Parser(dataSourceDef.config);
        if (!dataSourceObj.connect && typeof dataSourceObj.connect !== 'function') {
            throw new Error(`Data source for ${dataSourceDef.type} is missing "connect" function`);
        }
        if (!dataSourceObj.disconnect && typeof dataSourceObj.disconnect !== 'function') {
            throw new Error(`Data source for ${dataSourceDef.type} is missing "disconnect" function`);
        }
        if (!dataSourceObj.getClient && typeof dataSourceObj.getClient !== 'function') {
            throw new Error(`Data source for ${dataSourceDef.type} is missing "getClient" function`);
        }
        dataSources[dataSourceName] = dataSourceObj;
    });
    return dataSources;
}
exports.default = default_1;
//# sourceMappingURL=dataSourceParser.js.map