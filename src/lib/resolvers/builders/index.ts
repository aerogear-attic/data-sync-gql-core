// resolvers we can build
export = {
  // Matches the DataSource type ENUM in the models/dataSource.js
  InMemory: require('./nedb'),
  Postgres: require('./postgres')
}
