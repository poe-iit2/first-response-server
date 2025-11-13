// Import the PubSub class from the 'graphql-subscriptions' package
// This allows for implementing a basic publish/subscribe (pub/sub) system
import { PubSub } from "graphql-subscriptions"

// Create a new instance of PubSub for use in the application
const pubsub = new PubSub()
export default pubsub