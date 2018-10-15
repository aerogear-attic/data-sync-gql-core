"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONParse = require('json-parse-safe');
const { auditLog, log } = require('../../util/logger');
function buildResolver(dataSource, compiledRequestMapping, compiledResponseMapping) {
    return function resolve(obj, args, context, info) {
        return new Promise((resolve, reject) => {
            const dataSourceClient = dataSource.getClient();
            info['dataSourceType'] = dataSource.type;
            const queryString = compiledRequestMapping({
                context: {
                    arguments: args,
                    parent: obj
                }
            });
            const parsedQuery = JSONParse(queryString);
            if (parsedQuery.error) {
                log.error('Error when parsing query', queryString, parsedQuery.error);
                auditLog(false, context.request, info, obj, args, parsedQuery.error);
                return reject(parsedQuery.error);
            }
            const { operation, query, doc, options, update } = parsedQuery.value;
            switch (operation) {
                case 'findOne':
                    dataSourceClient.findOne(query, mapResponse);
                    break;
                case 'find':
                    dataSourceClient.find(query, mapResponse);
                    break;
                case 'insert':
                    dataSourceClient.insert(doc, mapResponse);
                    break;
                case 'update':
                    dataSourceClient.update(query, update, options || {}, mapUpdateResponse);
                    break;
                case 'remove':
                    dataSourceClient.remove(query, options || {}, mapResponse);
                    break;
                default:
                    auditLog(false, context.request, info, obj, args, `Unknown/unsupported nedb operation "${operation}"`);
                    return reject(new Error(`Unknown/unsupported nedb operation "${operation}"`));
            }
            function mapResponse(err, res) {
                if (err)
                    return reject(err);
                if (!res)
                    return resolve();
                const responseString = compiledResponseMapping({
                    context: {
                        result: res
                    }
                });
                const { value, error } = JSONParse(responseString);
                if (error) {
                    auditLog(false, context.request, info, obj, args, error.message);
                    return reject(error);
                }
                auditLog(true, context.request, info, obj, args, null);
                return resolve(value);
            }
            function mapUpdateResponse(err, numAffected, affectedDocuments) {
                if (numAffected === 0) {
                    return mapResponse(err, []);
                }
                return mapResponse(err, affectedDocuments);
            }
        });
    };
}
exports.buildResolver = buildResolver;
//# sourceMappingURL=nedb.js.map