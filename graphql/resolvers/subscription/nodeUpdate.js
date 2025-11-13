import pubsub from "../../../utils/pubsub.js"
import { withNodeUpdate } from "../../../utils/withNodeUpdate.js"

// Define a function that returns an async iterator for the "SEND_HELLO" event
// This allows clients to subscribe to the "SEND_HELLO" event and receive messages when this event is published
export const nodeUpdate = withNodeUpdate(
  () => pubsub.asyncIterator("NODE_UPDATE")
)
