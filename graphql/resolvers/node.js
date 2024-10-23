const { model } = require("mongoose")
const { nodeSchema } = require("../../models/node")
const Floor = require("./floor")

const NodeModel = model("Node", nodeSchema)

// Define a 'Node' class to encapsulate node-related operations and data
class Node {

  static async build(nodeId, context) {
    if(!context?.isAuth) throw new Error("Error retrieving Node data. You are not authenticated.")

    const node = await NodeModel.findById(nodeId)
    if (!node) {
      throw new Error(`Node ${nodeId} not found`)
    }

    return new Node(node, context)
  }

  constructor(node, context) {
    if(!context?.isAuth) throw new Error("Error retrieving Node data. You are not authenticated.")
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
    const InvisibleNode = require("./invisibleNode")

    const invisibleNodes = this.node.connections
    for(const invisibleNodeId of invisibleNodes) {
      const invisibleNode = await InvisibleNode.build(invisibleNodeId, this.context)

      const connectedNodes = await invisibleNode.connectedNodes()
      if(connectedNodes[0].id === this.id) {
        connections.push(connectedNodes[1])
      }else {
        connections.push(connectedNodes[0])
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

// Export the Node class for use in other parts of the application
module.exports = Node