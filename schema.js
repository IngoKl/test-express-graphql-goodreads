const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require('graphql')

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: '',

  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: (xml) => {
        const title = xml.GoodreadsResponse.book[0].title[0]
        return title
      }
    },
    description: {
      type: GraphQLString,
      resolve: xml => xml.GoodreadsResponse.book[0].description[0]
    },
    isbn: {
      type: GraphQLString,
      resolve: xml => xml.GoodreadsResponse.book[0].isbn[0]
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: (xml, args, context) => {
        const authorElements = xml.GoodreadsResponse.book[0].authors[0].author
        const ids = authorElements.map(elem => elem.id[0])
        return context.authorLoader.loadMany(ids)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: '',

  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: xml => xml.GoodreadsResponse.author[0].name[0]
    },
    about: {
      type: GraphQLString,
      resolve: xml => xml.GoodreadsResponse.author[0].about[0]
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: (xml, args, context) => {
        const ids = xml.GoodreadsResponse.author[0].books[0].book.map(elem => elem.id[0]._)
        return context.bookLoader.loadMany(ids)
      }
    }
  })
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '',

    fields: () => ({
      author: {
        type: AuthorType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (root, args, context) => context.authorLoader.load(args.id)
      },
      book: {
        type: BookType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (root, args, context) => context.bookLoader.load(args.id)
      }
    })
  })
})
