"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, DataTypes) {
    const DataSource = sequelize.define('DataSource', {
        name: DataTypes.STRING,
        type: DataTypes.ENUM('InMemory', 'Postgres'),
        config: DataTypes.JSON
    });
    DataSource.associate = function (models) {
        models.DataSource.hasMany(models.Resolver, { as: 'resolvers' });
    };
    return DataSource;
}
exports.default = default_1;
//# sourceMappingURL=dataSource.js.map