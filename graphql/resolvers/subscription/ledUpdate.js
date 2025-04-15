const pubsub = require("../../../utils/pubsub")
const { withFilter } = require("../../../utils/withFilter")

// Filters LED updates by nodeId
const ledUpdate = withFilter(
  () => pubsub.asyncIterator("LED_UPDATE"),
  async (payload, variables) => {
    const update = await payload.ledUpdate
    return !variables?.nodeId || update?.nodeId === variables.nodeId
  }
)

module.exports = {
  ledUpdate
}
