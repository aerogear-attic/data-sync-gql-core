"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const { compile } = require('./compiler');
const { log } = require('../util/logger');
const JSONParse = require('json-parse-safe');
function wrapResolverWithPublish(resolver, resolverMapping, pubsub) {
    const publisherConfig = JSONParse(resolverMapping.publish);
    if (publisherConfig.error) {
        return wrapResolverWithDefaultPublish(resolver, resolverMapping, pubsub);
    }
    resolverMapping.publish = publisherConfig.value;
    return wrapResolverWithCustomPublish(resolver, resolverMapping, pubsub);
}
exports.wrapResolverWithPublish = wrapResolverWithPublish;
function wrapResolverWithDefaultPublish(resolver, resolverMapping, pubsub) {
    function getDefaultPayload(operationName) {
        return `{ "${operationName}": {{ toJSON context.result }} }`;
    }
    const topic = resolverMapping.publish;
    const compiledPayload = compile(getDefaultPayload(topic));
    const publishOpts = {
        topic,
        compiledPayload
    };
    return resolveAndPublish(resolver, pubsub, publishOpts);
}
function wrapResolverWithCustomPublish(resolver, resolverMapping, pubsub) {
    const { topic, payload } = resolverMapping.publish;
    if (!topic) {
        throw Error(`publish object in resolver mapping ${resolverMapping.field} is missing 'topic' field`);
    }
    if (!payload) {
        throw Error(`publish object in resolver mapping ${resolverMapping.field} is missing 'payload' field`);
    }
    const publishOpts = {
        topic,
        compiledPayload: compile(payload)
    };
    return resolveAndPublish(resolver, pubsub, publishOpts);
}
function resolveAndPublish(resolverFn, pubsub, publishOpts) {
    return (obj, args, context, info) => {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield resolverFn(obj, args, context, info);
                resolve(result);
                const publishContext = {
                    context: {
                        result: result
                    }
                };
                pubsub.publish(publishOpts, publishContext);
            }
            catch (error) {
                log.error(error);
                reject(error);
            }
        }));
    };
}
//# sourceMappingURL=wrapResolverWithPublisher.js.map