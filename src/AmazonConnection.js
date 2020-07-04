const { Connection } = require('@elastic/elasticsearch')
const aws4 = require('aws4')

module.exports = awsConfig => {
  class AmazonConnection extends Connection {
    buildRequestObject (params) {
      const req = super.buildRequestObject(params)

      req.service = 'es'

      if (!req.headers) {
        req.headers = {}
      }

      // Fix the Host header, since HttpConnector.makeReqParams() appends
      // the port number which will cause signature verification to fail
      req.headers.host = req.hostname

      if (params.body) {
        req.headers['content-length'] = Buffer.byteLength(params.body, 'utf8')
        req.body = params.body
      } else {
        req.headers['content-length'] = 0
      }

      return aws4.sign(req, awsConfig.credentials)
    }
  }

  return AmazonConnection
}
