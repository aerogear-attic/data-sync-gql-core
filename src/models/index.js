// Adapted from https://github.com/sequelize/express-example/blob/master/models/index.js

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(module.filename)
const { log } = require('../lib/util/logger')
const db = {}

module.exports = (config) => {
  config.logging = log
  let sequelize = new Sequelize(config.database, config.username, config.password, config.options)

  // load all models in current dir
  fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })
    .forEach((file) => {
      let model = sequelize['import'](path.join(__dirname, file))
      db[model.name] = model
    })

  // setup model associations
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  db.sequelize = sequelize
  db.Sequelize = Sequelize

  db.sync = () => sequelize.sync({ force: false })

  db.reset = () => sequelize.dropAllSchemas({ logging: false })

  return db
}
