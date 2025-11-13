import { asyncIterator } from "../../../utils/pubsub"
import { withFilter } from "../../../utils/withFilter"
// const { withAuthorisation } = require("../../../utils/withAuthorisation")

// Define a filtered subscription for floor updates using 'withFilter'
// 'withFilter' takes two arguments:
// 1. A function that returns an async iterator for the subscription topic (in this case, "FLOOR_UPDATE")
// 2. A function that acts as a filter to decide whether the event should be passed to the subscriber
export const floorUpdate = withFilter(
  () => asyncIterator("FLOOR_UPDATE"),
  async (payload, variables) => {
    const floorUpdate = await payload.floorUpdate
    return floorUpdate?.id === variables?.id
  }
)
