// Import necessary packages
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const WebSocket = require('ws')
const authenticate = require("./middleware/authenticate")
const rateLimiter = require("./middleware/rateLimiter")
const authParse = require("./utils/authParse")

// Import GraphQL related tools
const { graphqlHTTP } = require("express-graphql")
const { useServer } = require("graphql-ws/lib/use/ws")
const { subscribe, execute } = require("graphql")

// Import GraphQL schema and resolvers
const { schema: graphqlSchema } = require("./graphql/typeDefs/schema");
const { resolvers } = require("./graphql/resolvers/resolvers");

// Import /test router
const test = require("./route/test")
const headerMiddleWare = require("./middleware/header")
const addHeaders = require("./utils/addHeaders")

// Load environment variables
dotenv.config()

// Create an instance of the Express application
const app = express()

app.options('*', (req, res) => {
  addHeaders(req, res)
  res.sendStatus(200)
})

// Add rate limiter
if(process.env.RATE_LIMIT !== "false") app.use(rateLimiter)

app.use(headerMiddleWare)

// Parse incoming JSON and URL-encoded data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Apply the custom authentication middleware
app.use(authenticate)

// Create a context object for GraphQL to include auth status and user info
const createContext = (req, res) => ({
  response: res || undefined,
  isAuth: req.isAuth || false,
  user: req.user || null
})

// Routes to test server and publish events on the pubsub system
app.use("/test", test)

app.get("/", (req, res) => {
  res.send({
    "message": "Hello World!"
  })
})

// GraphQL API endpoint, enables graphiql UI and sets up schema, resolvers, and context
app.use("/graphql", graphqlHTTP((req, res) => ({
  schema: graphqlSchema,
  rootValue: resolvers,
  context: createContext(req, res),
  graphiql: true
})))

// Connect to MongoDB using the conntextion string from environment variables
mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("MongoDB connected")

  // Start the HTTP server and listen on the specified PORT
  const server = app.listen(process.env.PORT || 5000, (req, res) => {
    // Log HTTP connection info
    const sAddress = server.address()
    console.log(`[${process.env.NODE_ENV}] GraphQL Server running on http://localhost:${sAddress.port}/graphql`)

    // Websocket configuration for GraphQL subscriptions
    const path = "/"
    const wsServer = new WebSocket.Server({
      server,
      path
    })

    // Set up the GraphQL Websocket server for handling real-time subscriptions
    // context: createContext(req, res),
    useServer({
      schema: graphqlSchema,
      roots: resolvers,
      context: (ctx) => {
        authParse(ctx.extra.request)
        return createContext(ctx.extra.request)
      },
      execute,
      subscribe,
      onConnect: (ctx) => {
        console.log('Connect');
      },
      onSubscribe: (ctx, msg) => {
        console.log('Subscribe');
      },
      onNext: (ctx, msg, args, result) => {
        console.debug('Next');
      },
      onError: (ctx, msg, errors) => {
        console.error('Error');
      },
      onComplete: (ctx, msg) => {
        console.log('Complete');
      }
    }, wsServer)

    // Log Websocket connection info
    const wsAddress = wsServer.address()
    console.log(`[${process.env.NODE_ENV}] GraphQL Websockets listening on ws://localhost:${wsAddress.port}${path}`)
  })
}).catch((err) => {
  // Log any errors during MongoDB connection
  console.log(err)
})