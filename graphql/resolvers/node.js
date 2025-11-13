import { model } from "mongoose"
import { nodeSchema } from "../../models/node.js"
import Floor from "./floor.js"

const NodeModel = model("Node", nodeSchema)

// Define a 'Node' class to encapsulate node-related operations and data
export default class Node {
  direction;

  static async build(nodeId, context) {
    if (!context?.isAuth) throw new Error("Error retrieving Node data. You are not authenticated.")

    const node = await NodeModel.findById(nodeId).exec()
    if (!node) {
      throw new Error(`Node ${nodeId} not found`)
    }

    return new Node(node, context)
  }

  constructor(node, context) {
    if (!context?.isAuth) throw new Error("Error retrieving Node data. You are not authenticated.")
    this.context = context
    this.node = node
    this.id = node.id || ""
    this.name = node.name || ""
    this.state = node.state
    this.isExit = node.isExit
    this.ui = node.ui
    this.updatedAt = node.updatedAt
    this.createdAt = node.createdAt
  }

  async connections() {
    const connections = []

    const invisibleNodes = this.node.connections
    for (const invisibleNode of invisibleNodes) {
      try {
        const node = await NodeModel.findById(invisibleNode.id)
        if (!node) continue
        connections.push(new Node(node, this.context))
        connections.at(-1).direction = invisibleNode.direction
      } catch (error) {
        console.log(error)
        continue
      }
    }

    return connections
  }

  async floor() {
    const floorId = this.node.floor
    const floor = await Floor.build(floorId, this.context)
    return floor
  }
}
