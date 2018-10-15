export default function (sequelize, DataTypes) {
  const GraphQLSchema = sequelize.define('GraphQLSchema', {
    name: DataTypes.STRING,
    schema: DataTypes.TEXT
  })

  GraphQLSchema.associate = function (models) {
    models.GraphQLSchema.hasMany(models.Resolver)
    models.GraphQLSchema.hasMany(models.Subscription)
  }

  return GraphQLSchema
}
