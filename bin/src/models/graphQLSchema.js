"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, DataTypes) {
    const GraphQLSchema = sequelize.define('GraphQLSchema', {
        name: DataTypes.STRING,
        schema: DataTypes.TEXT
    });
    GraphQLSchema.associate = function (models) {
        models.GraphQLSchema.hasMany(models.Resolver);
        models.GraphQLSchema.hasMany(models.Subscription);
    };
    return GraphQLSchema;
}
exports.default = default_1;
//# sourceMappingURL=graphQLSchema.js.map