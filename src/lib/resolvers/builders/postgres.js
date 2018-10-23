const JSONParse = require('json-parse-safe')

function buildPostgresResolver (dataSource, compiledRequestMapping, compiledResponseMapping) {
  return function resolve (obj, args, context, info) {
    return new Promise((resolve, reject) => {
      const dataSourceClient = dataSource.getClient()
      info['dataSourceType'] = dataSource.type

      const queryString = compiledRequestMapping({
        context: {
          arguments: args,
          parent: obj
        }
      })

      dataSourceClient.query(queryString, [], (err, res) => {
        if (err) return reject(err)

        const responseString = compiledResponseMapping({
          context: {
            result: res.rows
          }
        })

        let { value, error } = JSONParse(responseString)

        if (error) {
          // TODO better error message back to user when this happens
          context.auditLog(false, context, info, obj, args, error.message)
          return reject(error)
        }

        context.auditLog(true, context, info, obj, args, null)
        return resolve(value)
      })
    })
  }
}

module.exports = {
  buildResolver: buildPostgresResolver
}
