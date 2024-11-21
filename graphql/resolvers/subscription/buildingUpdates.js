const pubsub = require("../../../utils/pubsub")
// const { withAuthorisation } = require("../../../utils/withAuthorisation")

// Define a filtered subscription for building updates using 'withFilter'
// 'withFilter' takes two arguments:
// 1. A function that returns an async iterator for the subscription topic (in this case, "BUILDING_UPDATE")
// 2. A function that acts as a filter to decide whether the event should be passed to the subscriber
const buildingUpdates = pubsub.asyncIterator("BUILDING_UPDATES")

// Export the filtered subscription for use in GraphQL resolvers
module.exports = {
  buildingUpdates
}