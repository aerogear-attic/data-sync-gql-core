"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = Promise.resolve().then(() => require('lodash'));
const schemaParser = Promise.resolve().then(() => require('./lib/schemaParser'));
const emptySchemaString = Promise.resolve().then(() => require('./lib/util/emptySchema'));
const log = Promise.resolve().then(() => require('./lib/util/logger'));
const Model = Promise.resolve().then(() => require('./models'));
class Core {
    constructor(config, makeExecutableSchema) {
        this.makeExecutableSchema = makeExecutableSchema;
        this.models = Model(config);
        this.graphQLSchemas = this.getSchemas();
    }
    getModels() {
        return this.models;
    }
    connectActiveDataSources(dataSources) {
        log.info('Connecting data sources');
        const promises = Object.keys(dataSources).map(key => {
            const DataSource = dataSources[key];
            return DataSource.connect();
        });
        return Promise.all(promises);
    }
    disconnectActiveDataSources(dataSources) {
        log.info('Disconnecting data sources');
        const promises = Object.keys(dataSources).map(key => {
            const DataSource = dataSources[key];
            return DataSource.disconnect();
        });
        return Promise.all(promises);
    }
    buildSchema(schemaName, pubsub, schemaDirectives) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const models = yield this.getModels();
            let graphQLSchemaString = yield this.models.GraphQLSchema.findOne({
                where: {
                    name: schemaName
                }
            }).then(schema => {
                if (schema) {
                    return schema.schema;
                }
            });
            let dataSourcesJson = yield models.DataSource.findAll({ raw: true });
            const subscriptionsJson = yield models.Subscription.findAll({ raw: true });
            const resolvers = yield models.Resolver.findAll({
                include: [models.DataSource]
            });
            let resolversJson = resolvers.map((resolver) => {
                return resolver.toJSON();
            });
            if (_.isEmpty(graphQLSchemaString) || _.isEmpty(dataSourcesJson) || _.isEmpty(resolversJson)) {
                log.warn('At least one of schema, dataSources or resolvers is missing. Using noop defaults');
                graphQLSchemaString = emptySchemaString;
                resolversJson = dataSourcesJson = {};
            }
            try {
                return schemaParser(graphQLSchemaString, dataSourcesJson, resolversJson, subscriptionsJson, schemaDirectives, pubsub, this.makeExecutableSchema);
            }
            catch (error) {
                log.error('Error while building schema.');
                log.error(error);
                throw (error);
            }
        });
    }
    getSchemas() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.models.GraphQLSchema.findAll();
        });
    }
}
exports.Core = Core;
module.exports = Core;
//# sourceMappingURL=core.js.map