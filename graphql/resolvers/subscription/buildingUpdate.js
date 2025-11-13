import { model } from "mongoose"
import pubsub from "../../../utils/pubsub.js"
import { withFilter } from "../../../utils/withFilter.js"
import { PubSub } from "graphql-subscriptions"
// const { withAuthorisation } = require("../../../utils/withAuthorisation")

// Define a filtered subscription for building updates using 'withFilter'
// 'withFilter' takes two arguments:
// 1. A function that returns an async iterator for the subscription topic (in this case, "BUILDING_UPDATE")
// 2. A function that acts as a filter to decide whether the event should be passed to the subscriber
export const buildingUpdate = withFilter(
  () => pubsub.asyncIterator("BUILDING_UPDATE"),
  async (payload, variables) => {
    const buildingUpdate = await payload.buildingUpdate
    return buildingUpdate?.id === variables?.id
  }
)
