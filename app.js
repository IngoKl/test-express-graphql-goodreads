const express = require('express')
const graphqlHTTP = require('express-graphql')
const fetch = require('node-fetch')
const DataLoader = require('dataloader')
const util = require('util')
const schema = require('./schema')
const parseXML = util.promisify(require('xml2js').parseString)
const app = express()
const port = 4001
const api_key = ''

const getAuthor = id =>
fetch(`https://www.goodreads.com/author/show.xml?id=${id}&key=${api_key}`)
.then(response => response.text())
.then( function(x) { return x.replace("\ufeff", ""); } )
.then( function(x) { return x.trim(); } )
.then(parseXML)

const getBook = id =>
fetch(`https://www.goodreads.com/book/show/${id}.xml?key=${api_key}`)
.then(response => response.text())
.then( function(x) { return x.replace("\ufeff", ""); } )
.then( function(x) { return x.trim(); } )
.then(parseXML)

app.use('/graphql', graphqlHTTP( req => {

  const authorLoader = new DataLoader(keys =>
    Promise.all(keys.map(getAuthor)))

  const bookLoader = new DataLoader(keys =>
    Promise.all(keys.map(getBook)))

  return {
    schema,
    context: {
      authorLoader,
      bookLoader
    },
    graphiql: true
  }
}))

app.listen(port)
console.log(`Listening on port ${port}`)