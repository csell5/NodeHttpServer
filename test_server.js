const T = require('tap')
const HTTP = require('http')
const Server = require('./server')

Server.listen()

const options = {
  host: 'localhost',
  port: 8080,
  path: '/test',
  method: 'GET'
}

const testResults = Promise.all([
  
  T.test('Call server check for 200', (test) => {
    HTTP.request(options, (res) => {
      T.equal(res.statusCode, 200, 'http status code')
      test.end()
    }).end()
  }),

  T.test('get server path /test', (test) => {
    HTTP.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        test.match(body, `Path Hit: ${options.path}`, 'http path not found')
        test.end()
      })

    }).end()
  }),

  T.test('get server not found', (test) => {
    HTTP.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        test.notMatch(body, '/fail', 'http path not found')
        test.end()
      })

    }).end()
  }),
  
  T.test('get server not found', (test) => {
    options.path = '/new/path'

    HTTP.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        test.match(body, options.path, 'http path not found')
        test.end()
      })

    }).end()
  })

]).then( () => {
  Server.close()
})
