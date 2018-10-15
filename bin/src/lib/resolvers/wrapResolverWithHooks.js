"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = require('lodash');
const { log, buildPath } = require('../util/logger');
function wrapResolverWithHooks(resolverFn, resolverMapping, httpClient) {
    return (obj, args, context, info) => {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (resolverMapping.preHook && !_.isEmpty(resolverMapping.preHook)) {
                const payload = {
                    hookType: 'preHook',
                    operationType: info.operation.operation,
                    fieldName: info.fieldname,
                    parentTypeName: info.parentType.name,
                    path: buildPath(info.path),
                    args: args
                };
                httpClient.post(resolverMapping.preHook, payload)
                    .then(function (response) {
                    log.info(response);
                })
                    .catch(function (error) {
                    log.err(error);
                });
            }
            try {
                const result = yield resolverFn(obj, args, context, info);
                resolve(result);
            }
            catch (error) {
                log.error(error);
                reject(error);
            }
        })).then(function (result) {
            if (resolverMapping.postHook && !_.isEmpty(resolverMapping.postHook)) {
                const payload = {
                    hookType: 'postHook',
                    operationType: info.operation.operation,
                    fieldName: info.fieldname,
                    parentTypeName: info.parentType.name,
                    path: buildPath(info.path),
                    result: result
                };
                httpClient.post(resolverMapping.postHook, payload)
                    .then(function (response) {
                    log.info(response);
                })
                    .catch(function (error) {
                    log.err(error);
                });
            }
            return result;
        });
    };
}
exports.wrapResolverWithHooks = wrapResolverWithHooks;
//# sourceMappingURL=wrapResolverWithHooks.js.map