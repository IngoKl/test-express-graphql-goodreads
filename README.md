This is a very simple **example** of a GraphQL endpoint for accessing [Goodread's](https://www.goodreads.com/) API. 
This requires a current version of NodeJS (i.e. 8.6.x). This is heavily based on [Fun Fun Function's](https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q) show on GraphQL :).

## Running
After setting a valid API key in `app.js` just run:

```
npm install
node app.js
```

## Accessing the Endpoint
There will be a GraphiQL interface running on /graphql.
You can now query Goodreads...

```
query {
  author(id: 50) {
    name
    about
    books {
      title
      description
    }
  }
}
```
