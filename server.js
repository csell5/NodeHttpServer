const HTTP = require('http')
const HTTP_DISPATCHER = require('httpdispatcher')
const WINSTON = require('winston')

const dispatcher = new HTTP_DISPATCHER()
const PORT = process.env.port || 8080

const handleRequest = (request, response) => {
  WINSTON.log('info', `Route requested: ${request.url}`)
  dispatcher.dispatch(request, response)
}

const server = HTTP.createServer(handleRequest)
require('./routes')(dispatcher)

exports.listen = () => {
  server.listen(PORT, () => {
    WINSTON.log('info', `HTTP server listening on http://localhost:${PORT}`)
  })
}

exports.close = (next) => {
  server.close(next)
}

const shouldStart = process.argv.find((n) => n === '--start')
if (shouldStart) {
  exports.listen()
}
