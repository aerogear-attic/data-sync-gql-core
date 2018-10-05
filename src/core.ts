const _ = require('lodash')

const schemaParser = require('./lib/schemaParser')
const emptySchemaString = require('./lib/util/emptySchema')
const { log } = require('./lib/util/logger')
const Model = require('./models')

export interface Core {

  getModels()

  connectActiveDataSources(dataSources: JSON)

  disconnectActiveDataSources(dataSources: JSON)

  buildSchema(schemaName: String, pubsub: any, schemaDirectives: JSON)
}

export class Core implements Core {

  public makeExecutableSchema : any;
  public models: any;
  public graphQLSchemas: Promise<void>;


  constructor (config, makeExecutableSchema) {
    this.makeExecutableSchema = makeExecutableSchema
    this.models = Model(config)
    this.graphQLSchemas = this.getSchemas()
  }

  getModels () {
    return this.models
  }

  connectActiveDataSources (dataSources) {
    log.info('Connecting data sources')
    const promises = Object.keys(dataSources).map(key => {
      const DataSource = dataSources[key]
      return DataSource.connect()
    })
    return Promise.all(promises)
  }

  disconnectActiveDataSources (dataSources) {
    log.info('Disconnecting data sources')
    const promises = Object.keys(dataSources).map(key => {
      const DataSource = dataSources[key]
      return DataSource.disconnect()
    })
    return Promise.all(promises)
  }

  async buildSchema (schemaName, pubsub, schemaDirectives) {
    const models = await this.getModels()

    let graphQLSchemaString = await this.models.GraphQLSchema.findOne({
      where: {
        name: schemaName
      }
    }).then(schema => {
      if (schema) {
        return schema.schema
      }
    })

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
    await this.models.GraphQLSchema.findAll()
  }
}

module.exports = Core
