const log = require('pino')()

function getClientInfoFromHeaders (request) {
  if (request && request.headers && request.headers['data-sync-client-info']) {
    const encoded = request.headers['data-sync-client-info']
    let buf
    try {
      buf = Buffer.from(encoded, 'base64')
    } catch (e) {
      log.error('Unable decode base64 data-sync-client-info header provided by the client. Message: ' + e.message)
      return undefined
    }

    const decoded = buf.toString('utf8')
    try {
      return JSON.parse(decoded)
    } catch (e) {
      log.error('Unable to parse data-sync-client-info header provided by the client. Message: ' + e.message)
      return undefined
    }
  }
  return undefined
}

module.exports = {getClientInfoFromHeaders}
