const { $$asyncIterator } = require("iterall")
const { model } = require("mongoose")
const { nodeSchema } = require("../models/node")
const NodeModel = model("Node", nodeSchema)
const pubsub = require("../utils/pubsub")
const Floor = require("../graphql/resolvers/floor")

function withNodeUpdate(
  asyncIteratorFn
) {
  return async (args, context, info) => {

    const nodeId = args.id

    const node = await NodeModel.findById(nodeId).exec()

    if(node){
      node.state = "compromised"
      await node.save()
      // TODO: Create a log here
      pubsub.publish("FLOOR_UPDATE", {
        floorUpdate: Floor.build(node.floor.toString(), {
          isAuth: true
        })
      })
    }


    console.log(args, context, info)

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

module.exports = {
  withNodeUpdate
}