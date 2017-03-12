const T = require('tap')
const HTTP = require('http')
const Server = require('./server')

Server.listen()

const options = {
  host: 'localhost',
  port: 8080,
  method: 'GET'
}

const testResults = Promise.all([
  
  T.test('get route for / and check for 200', (test) => {
    options.path = '/'

    HTTP.request(options, (res) => {
      T.equal(res.statusCode, 200, 'http status code')
      test.end()
    }).end()
  }),

  T.test('Call invalid server path checking for 400', (test) => {
    options.path = '/invalid/path/for/dispatcher'
    
    HTTP.request(options, (res) => {
      T.equal(res.statusCode, 404, 'http status code')
      test.end()
    }).end()
  }),
  
  T.test('get route body for index and validate', (test) => {
    options.path = '/'

    HTTP.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        test.match(body, `Index Page`, 'http path not found')
        test.end()
      })

    }).end()
  }),

  T.test('call api get route', (test) => {
    options.path = '/api/customer'

    HTTP.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        const postData = JSON.parse(body);
        test.strictSame(postData.firstName, 'Tony', 'First Name is wrong')
        test.strictSame(postData.lastName, 'Stark', 'Last Name is wrong')
        test.end()
      })

    }).end()
  }),

  T.test('call api post route', (test) => {
    options.path = '/api/customer'
    options.method = 'POST'

    const postData = {
      a: 'a',
      b: 'b',
      c: 'c'
    }
    
    options.data = postData

    HTTP.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        T.equal(res.statusCode, 201, 'http status code')
        body += chunk
      })

      res.on('end', () => {
        const postData = JSON.parse(body);
        test.strictSame(postData.status, 'success', 'POSTED')
        test.end()
      })

    }).end()
  })


]).then( () => {
  Server.close()
})
