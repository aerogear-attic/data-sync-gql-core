# AeroGear Sync Core Execution Framework

This is the core module for data sync which produces an executable schema from data models.

This module is used in the following projects:

* [aerogear/data-sync-server](https://github.com/aerogear/data-sync-server)
* [aerogear/data-sync-ui](https://github.com/aerogear/data-sync-ui)

# Functionality

* Provides access to the models required for Data Sync
* Provides any module with an executable schema
* Connect to active datasources

# Usage

Currently, Data sync uses this module in the following way:

It requires the module, along with makeExecutableSchema from graphql-tools (required as graphql needs each module to only rely on its own tooling).

```js
const { Core } = require('@aerogear/data-sync-gql-core')
const { makeExecutableSchema } = require('graphql-tools')
```

It initialises the Core class with the config and the makeExecutableSchema object.

```js
const core = new Core(myConfig, makeExecutableSchema)
```

Use the core to obtain the schema and dataSources.

```js
const { schema, dataSources } = core.buildSchema(schemaName, pubsub, schemaDirectives)
```

It can then connect to the data sources.

```js
await core.connectActiveDataSources(dataSources)
```

Or disconnect from the data sources.

```js
await core.disconnectActiveDataSources(dataSources)
```

# Planned Work

* Convert this module to TypeScript to improve its usability and reliability as part of the overall sync offering.