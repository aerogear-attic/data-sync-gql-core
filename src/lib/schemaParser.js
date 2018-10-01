const dataSourceParser = require('./datasources/dataSourceParser')
const resolverMapper = require('./resolvers/resolverMapper')
const subscriptionsMapper = require('./subscriptions/subscriptionMapper')

module.exports = function (schemaString, dataSourcesJson, resolverMappingsJson, subscriptionMappingsJson, schemaDirectives, pubsub, makeExecutableSchema) {
  const dataSources = dataSourceParser(dataSourcesJson)
  const subscriptionResolvers = subscriptionsMapper(subscriptionMappingsJson, pubsub)
  const dataResolvers = resolverMapper(dataSources, resolverMappingsJson, pubsub)

  const resolvers = {...subscriptionResolvers, ...dataResolvers}
  const schema = makeExecutableSchema({
    typeDefs: [schemaString],
    resolvers: resolvers,
    schemaDirectives
  })
  return {schema, dataSources}
}
