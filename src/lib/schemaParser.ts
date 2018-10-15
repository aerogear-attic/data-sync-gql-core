import dataSourceParser from './datasources/dataSourceParser'
import resolverMapper from './resolvers/resolverMapper'
import { subscriptionsMapper } from './subscriptions/subscriptionMapper'

export default (schemaString, dataSourcesJson, resolverMappingsJson, subscriptionMappingsJson, schemaDirectives, pubsub, makeExecutableSchema) => {
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
