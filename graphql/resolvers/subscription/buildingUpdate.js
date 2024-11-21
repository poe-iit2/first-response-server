const { model } = require("mongoose")
const pubsub = require("../../../utils/pubsub")
const { withFilter } = require("../../../utils/withFilter")
// const { withAuthorisation } = require("../../../utils/withAuthorisation")

// Define a filtered subscription for building updates using 'withFilter'
// 'withFilter' takes two arguments:
// 1. A function that returns an async iterator for the subscription topic (in this case, "BUILDING_UPDATE")
// 2. A function that acts as a filter to decide whether the event should be passed to the subscriber
const buildingUpdate = withFilter(
  () => pubsub.asyncIterator("BUILDING_UPDATE"),
  async (payload, variables) => {
    const buildingUpdate = await payload.buildingUpdate
    return buildingUpdate?.id === variables?.id
  }
)

// Export the filtered subscription for use in GraphQL resolvers
module.exports = {
  buildingUpdate
}