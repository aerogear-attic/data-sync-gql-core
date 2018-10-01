const _ = require('lodash')
const { ApolloServer } = require('apollo-server-express')

const schemaParser = require('./lib/schemaParser')
const emptySchemaString = require('./lib/util/emptySchema')
const { log } = require('./lib/util/logger')
const Model = require('./models')

class Core {
  constructor (config, makeExecutableSchema) {
    this.makeExecutableSchema = makeExecutableSchema
    this.models = Model(config)
    this.graphQLSchemas = this.getSchemas()
  }

  async getModels () {
    return this.models
  }

  async connectActiveDataSources (dataSources) {
    log.info('Connecting data sources')
    const promises = Object.keys(dataSources).map(key => {
      const DataSource = dataSources[key]
      return DataSource.connect()
    })
    await Promise.all(promises)
  }

  async createGraphQLApi (schemaName, config) {
    const { app, path } = config
    const { schema } = await this.buildSchema(schemaName)
    const apolloServer = new ApolloServer({
      schema
    })
    apolloServer.applyMiddleware({ app, path })
  }

  async buildSchema (schemaName) {
    const models = await this.getModels()
    const pubsub = null
    const schemaDirectives = null
    let graphQLSchemaString = null

    const graphQLSchemas = await this.models.GraphQLSchema.findAll()
    if (!_.isEmpty(graphQLSchemas)) {
      for (let graphQLSchema of graphQLSchemas) {
        if (graphQLSchema.name === schemaName) {
          graphQLSchemaString = graphQLSchema.schema
          break
        }
      }
      if (!graphQLSchemaString) {
        // only fail when there are schemas defined but there's none with the name 'default'
        // things should work fine when there's no schema at all
        throw new Error(`No schema with name ${schemaName} found.`)
      }
    }

    let dataSourcesJson = await models.DataSource.findAll({raw: true})
    const subscriptionsJson = await models.Subscription.findAll({raw: true})
    const resolvers = await models.Resolver.findAll({
      include: [models.DataSource]
    })
    let resolversJson = resolvers.map((resolver) => {
      return resolver.toJSON()
    })

    if (_.isEmpty(graphQLSchemaString) || _.isEmpty(dataSourcesJson) || _.isEmpty(resolversJson)) {
      log.warn('At least one of schema, dataSources or resolvers is missing. Using noop defaults')
      graphQLSchemaString = emptySchemaString
      resolversJson = dataSourcesJson = {}
    }

    try {
      return schemaParser(graphQLSchemaString, dataSourcesJson, resolversJson, subscriptionsJson, schemaDirectives, pubsub, this.makeExecutableSchema)
    } catch (error) {
      log.error('Error while building schema.')
      log.error(error)
      throw (error)
    }
  }

  async getSchemas () {
    const graphQLSchemas = await this.models.GraphQLSchema.findAll()
    return graphQLSchemas
  }

  async getDataSources () {

  }
}

module.exports = Core
