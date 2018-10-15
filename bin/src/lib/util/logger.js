"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = require('pino')();
const auditLogger = exports.log.child({ tag: 'AUDIT' });
const auditLogEnabled = process.env.AUDIT_LOGGING !== 'false';
function auditLog(success, request, info, parent, args, msg) {
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
        });
    }
}
exports.auditLog = auditLog;
function buildPath(path) {
    let pathItems = [];
    let currPath = path;
    while (currPath) {
        pathItems.unshift(currPath.key);
        currPath = currPath.prev;
    }
    return pathItems.join('.');
}
exports.buildPath = buildPath;
//# sourceMappingURL=logger.js.map