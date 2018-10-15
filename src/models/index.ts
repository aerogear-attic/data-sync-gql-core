// Adapted from https://github.com/sequelize/express-example/blob/master/models/index.js

import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
const basename = path.basename(module.filename)

export default (config: any) : JSON => {
  const { database, username, password, options } = config;
  const { host, port } = options;
  let sequelize = undefined;
  sequelize = new Sequelize(database, username, password, { host, port})
  let db : any = {};
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

  return JSON.parse(db)
}
