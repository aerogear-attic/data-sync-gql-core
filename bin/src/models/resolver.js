"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, DataTypes) {
    const Resolver = sequelize.define('Resolver', {
        type: DataTypes.STRING,
        field: DataTypes.STRING,
        preHook: DataTypes.STRING,
        postHook: DataTypes.STRING,
        requestMapping: DataTypes.TEXT,
        responseMapping: DataTypes.TEXT,
        publish: DataTypes.TEXT
    });
    Resolver.associate = (models) => {
        models.Resolver.belongsTo(models.DataSource, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
        models.Resolver.belongsTo(models.GraphQLSchema, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Resolver;
}
exports.default = default_1;
//# sourceMappingURL=resolver.js.map