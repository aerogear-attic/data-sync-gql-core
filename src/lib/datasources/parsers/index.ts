// data sources we can parse
export = {
  // Matches the DataSource type ENUM in the models/dataSource.js
  InMemory: require('./nedb'),
  Postgres: require('./postgres')
}
