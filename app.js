const express = require('express');
const mongoose = require('mongoose');


// Middleware Declaration
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

// Express
const app = express();

// Middleware
app.use(bodyParser.json());



// Models


const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');


app.get('/', (req, res, next) => {
    res.send('Hello World!');
});


app.use('/graphql', graphqlHttp({
    
    // Graphical Interface
    graphiql: true,
    
    // GraphQL Schemas
    schema: graphQlSchema, 
    // Resolver Functions
    rootValue: graphQlResolvers
}));


mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds259207.mlab.com:59207/graphql-react`, { useNewUrlParser: true })
    .then(() => {
        // Do something here if you must (O.o)
        console.log('Mongoose connected!')
    }).catch((err) => { console.log(err); });


// Set port
app.listen(3000);





