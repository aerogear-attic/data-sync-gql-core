const log = require('pino')()
const auditLogger = log.child({tag: 'AUDIT'})
const { buildPath } = require('./graphqlPathUtil')
const { getClientInfoFromHeaders } = require('./internal/loggerHelper')

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

module.exports = {log, auditLog}
