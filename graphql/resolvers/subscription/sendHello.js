import { asyncIterator } from "../../../utils/pubsub"
import { withAuthorisation } from "../../../utils/withAuthorisation"

// Define a function that returns an async iterator for the "SEND_HELLO" event
// This allows clients to subscribe to the "SEND_HELLO" event and receive messages when this event is published
export const sendHello = withAuthorisation(
  () => asyncIterator("SEND_HELLO"),
  ["user", "admin"]
)
