const pubsub = require("../../../utils/pubsub")
const { withFilter } = require("../../../utils/withFilter")

// Filters updates by nodeId, if provided in the subscription variables
const deviceUpdate = withFilter(
  () => pubsub.asyncIterator("DEVICE_UPDATE"),
  async (payload, variables) => {
    const update = await payload.deviceUpdate
    return !variables?.nodeId || update?.nodeId === variables.nodeId
  }
)

module.exports = {
  deviceUpdate
}
