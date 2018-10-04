module.exports = (sequelize, DataTypes) => {
  const GraphQLSchema = sequelize.define('GraphQLSchema', {
    name: DataTypes.STRING,
    schema: DataTypes.TEXT
  })

  GraphQLSchema.associate = function (models) {
    models.GraphQLSchema.hasMany(models.Resolver, { as: 'resolvers' })
  }

  GraphQLSchema.associate = function (models) {
    models.GraphQLSchema.hasMany(models.Subscription, { as: 'subscriptions' })
  }

  return GraphQLSchema
}
