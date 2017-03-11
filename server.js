const HTTP = require('http')
const WINSTON = require('winston')

const PORT = process.env.port || 8080

const handleRequest = (request, response) => {
  const resMessage = `It Works!! Path Hit: ${request.url}`
  WINSTON.log('info', resMessage)
  response.end(resMessage)
}

const server = HTTP.createServer(handleRequest)

exports.listen = () => {
  server.listen(PORT, () => {
    WINSTON.log('info', `HTTP server listening on http://localhost:${PORT}`)
  })
}

exports.close = (next) => {
  server.close(next)
}

const shouldStart = process.argv.find( (n) => n === '--start' )
if ( shouldStart ) {
  this.listen()
}
