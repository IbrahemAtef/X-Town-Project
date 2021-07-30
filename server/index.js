const express = require('express');
const app = express();
const path = require('path');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const cors = require('cors');
const schema = require('./schema');

// Middleware
app.use(express.json({ extended: false }))
app.use(cors());

// GraphQL
app.use(
  '/api', 
  expressGraphQL((req) => ({
    schema,
    context: {
      user: req.user,
    },
    graphiql: true,
  }))
);

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`))
