const pubsub = require("../../../utils/pubsub")
const { withNodeUpdate } = require("../../../utils/withNodeUpdate")

// Define a function that returns an async iterator for the "SEND_HELLO" event
// This allows clients to subscribe to the "SEND_HELLO" event and receive messages when this event is published
const nodeUpdate = withNodeUpdate(
  () => pubsub.asyncIterator("NODE_UPDATE")
)

// Export the 'sendHello' function for use in GraphQL resolvers or other parts of the application
module.exports = {
  nodeUpdate
}