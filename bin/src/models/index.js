"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const db = {
    sequelize: null,
    Sequelize: null,
    sync: null,
    reset: null
};
exports.default = (config) => {
    const { database, username, password, options } = config;
    const { host, port } = options;
    let sequelize = undefined;
    sequelize = new Sequelize(database, username, password, { host, port });
    let db = {};
    fs
        .readdirSync(__dirname)
        .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
        .forEach((file) => {
        let model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });
    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    db.sync = () => sequelize.sync({ force: false });
    db.reset = () => sequelize.dropAllSchemas({ logging: false });
    return JSON.parse(db);
};
//# sourceMappingURL=index.js.map