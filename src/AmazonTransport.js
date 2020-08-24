const { Transport } = require('@elastic/elasticsearch')

module.exports = awsConfig => {
  class AmazonTransport extends Transport {
    request (params, options, callback) {
      return awsConfig.getCredentials(() => {
        return super.request(params, options, callback)
      })
    }
  }

  return AmazonTransport
}
