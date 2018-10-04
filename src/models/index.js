// Adapted from https://github.com/sequelize/express-example/blob/master/models/index.js

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(module.filename)
const db = {}

module.exports = (config) => {
  let sequelize = null

  if (process.env.NODE_ENV === 'test') {
    sequelize = new Sequelize('sqlite://:memory:', null, null, { dialect: 'sqlite', logging: false })
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: 'postgres',
      operatorsAliases: false,
      logging: false
    })
  }

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
