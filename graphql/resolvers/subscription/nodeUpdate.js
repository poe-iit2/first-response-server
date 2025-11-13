import { asyncIterator } from "../../../utils/pubsub"
import { withNodeUpdate } from "../../../utils/withNodeUpdate"

// Define a function that returns an async iterator for the "SEND_HELLO" event
// This allows clients to subscribe to the "SEND_HELLO" event and receive messages when this event is published
export const nodeUpdate = withNodeUpdate(
  () => asyncIterator("NODE_UPDATE")
)
