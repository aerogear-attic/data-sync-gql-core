import { export as log} from 'pino'
const auditLogger = log.child({tag: 'AUDIT'})

const auditLogEnabled = process.env.AUDIT_LOGGING !== 'false'

export function auditLog (success, request, info, parent, args, msg) {
  if (auditLogEnabled) {
    auditLogger.info({
      msg: msg || '',
      requestId: request ? request.id : '',
      operationType: info.operation.operation,
      fieldName: info.fieldname,
      parentTypeName: info.parentType.name,
      path: buildPath(info.path),
      success: success,
      parent: parent,
      arguments: args,
      dataSourceType: info.dataSourceType || ''
    })
  }
}

// builds path for a GraphQL operation
export function buildPath (path) {
  let pathItems = []
  let currPath = path
  while (currPath) {
    pathItems.unshift(currPath.key) // prepend
    currPath = currPath.prev
  }

  return pathItems.join('.')
}
