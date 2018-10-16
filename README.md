# AeroGear Sync Core Execution Framework

This is the core module for data sync which produces an executable schema from data models.

# Functionality

* Provides access to the models required for Data Sync
* Provides any module with an executable schema
* Connect to active datasources

# Usage

Currently, Data sync uses this module in the following way:

It requires the module, along with makeExecutableSchema from graphql-tools (required as graphql needs each module to only rely on its own tooling):
```
const { Core } = require('@aerogear/data-sync-gql-core')
const { makeExecutableSchema } = require('graphql-tools')

```
It initialises the Core class with the config and the makeExecutableSchema object:s
```
const core = new Core(myConfig, makeExecutableSchema)
```

Uses the core to obtain the schema and dataSources:
```
const { schema, dataSources } = core.buildSchema(schemaName, pubsub, schemaDirectives)
```

It can then connect to data sources:
```
core.connectActiveDataSources(dataSources)
```

Or disconnect from data sources:
```
core.disconnectActiveDataSources(dataSources)
```

# Planned Work

* Convert this module to typescript to improve its usability and reliability as part of the overall sync offering.