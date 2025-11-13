import { $$asyncIterator } from "iterall"
import { model } from "mongoose"
import { nodeSchema } from "../models/node"
const NodeModel = model("Node", nodeSchema)
import { publish } from "../utils/pubsub"
import Floor from "../graphql/resolvers/floor"

function withNodeUpdate(
  asyncIteratorFn
) {
  return async (args, context, info) => {

    const nodeId = args.id

    const node = await NodeModel.findById(nodeId).exec()

    if (node) {
      node.state = "compromised"
      await node.save()
      // TODO: Create a log here
      publish("FLOOR_UPDATE", {
        floorUpdate: Floor.build(node.floor.toString(), {
          isAuth: true
        })
      })
    }

    // If we get here, the user is not allowed
    const asyncIterator2 = {
      next() {
        return Promise.resolve({ done: true })
      },
      return() {
        return Promise.resolve({ done: true })
      },
      throw(error) {
        return Promise.resolve({ done: true })
      },
      [$$asyncIterator]() {
        return this
      }
    }
    return asyncIterator2
  }
}

export default {
  withNodeUpdate
}