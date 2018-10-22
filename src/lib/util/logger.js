const log = require('pino')()
const auditLogger = log.child({tag: 'AUDIT'})

const auditLogEnabled = process.env.AUDIT_LOGGING !== 'false' && process.env.AUDIT_LOGGING !== false

function auditLog (success, request, info, parent, args, msg) {
  if (auditLogEnabled) {
    auditLogger.info({
      audit: {
        msg: msg || '',
        requestId: request ? request.id : '',
        operationType: info.operation.operation,
        fieldName: info.fieldname,
        parentTypeName: info.parentType.name,
        path: buildPath(info.path),
        success: success,
        parent: parent,
        arguments: args,
        dataSourceType: info.dataSourceType || '',
        clientInfo: getClientInfoFromHeaders(request)
      }
    })
  }
}

function getClientInfoFromHeaders (request) {
  if (request && request.headers && request.headers['data-sync-client-info']) {
    const encoded = request.headers['data-sync-client-info']
    const buf = Buffer.from(encoded, 'base64')
    const decoded = buf.toString('utf8')
    try {
      return JSON.parse(decoded)
    } catch (e) {
      log.error('Unable to parse client-info header provided by the client. Message: ' + e.message)
      return undefined
    }
  }
  return undefined
}

// builds path for a GraphQL operation
function buildPath (path) {
  let pathItems = []
  let currPath = path
  while (currPath) {
    pathItems.unshift(currPath.key) // prepend
    currPath = currPath.prev
  }

  return pathItems.join('.')
}

module.exports = {log, auditLog, buildPath}
