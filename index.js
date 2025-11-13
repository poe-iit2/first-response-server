// Import necessary packages
import express, { json, urlencoded } from "express"
import { connect } from "mongoose"
import { config } from "dotenv"
import { WebSocketServer } from 'ws'
import authenticate from "./middleware/authenticate.js"
import rateLimiter from "./middleware/rateLimiter.js"
import authParse from "./utils/authParse.js"

// Import GraphQL related tools
import { graphqlHTTP } from "express-graphql"
import { useServer } from "graphql-ws/lib/use/ws"
import { subscribe, execute } from "graphql"

// Import GraphQL schema and resolvers
import { schema as graphqlSchema } from "./graphql/typeDefs/schema.js"
import { resolvers } from "./graphql/resolvers/resolvers.js"

// Import /test router
import test from "./route/test.js"
import headerMiddleWare from "./middleware/header.js"
import addHeaders from "./utils/addHeaders.js"

// Load environment variables
config()

// Create an instance of the Express application
const app = express()

app.options('*', (req, res) => {
  addHeaders(req, res)
  res.sendStatus(200)
})

// Add rate limiter
if (process.env.RATE_LIMIT !== "false") app.use(rateLimiter)

app.use(headerMiddleWare)

// Parse incoming JSON and URL-encoded data
app.use(json())
app.use(urlencoded({ extended: true }))

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
connect(process.env.DATABASE_URL).then(() => {
  console.log("MongoDB connected")

  // Start the HTTP server and listen on the specified PORT
  const server = app.listen(process.env.PORT || 5000, (req, res) => {
    // Log HTTP connection info
    const sAddress = server.address()
    console.log(`[${process.env.NODE_ENV}] GraphQL Server running on http://localhost:${sAddress.port}/graphql`)

    // Websocket configuration for GraphQL subscriptions
    const path = "/"
    const wsServer = new WebSocketServer({
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
        console.log('Connect')
      },
      onSubscribe: (ctx, msg) => {
        console.log('Subscribe')
      },
      onNext: (ctx, msg, args, result) => {
        console.debug('Next')
      },
      onError: (ctx, msg, errors) => {
        console.error('Error')
      },
      onComplete: (ctx, msg) => {
        console.log('Complete')
      },
      onOperation: (ctx, msg) => {
        console.log('Operation')
      },
      onClose: (ctx, msg) => {
        console.log("Close")
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