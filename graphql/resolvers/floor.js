import { model } from "mongoose"
import { floorSchema } from "../../models/floor"
import Building from "./building"
import Node from "./node"

const FloorModel = model("Floor", floorSchema)

// Define a 'Floor' class to encapsulate floor-related operations and data
export default class Floor {
  static async build(floorId, context) {
    if (!context?.isAuth) throw new Error("Error retrieving data. You are not authenticated.")
    const floor = await FloorModel.findById(floorId).exec()

    if (!floor) {
      throw new Error(`Floor ${floorId} not found`)
    }
    return new Floor(floor, context)
  }

  constructor(floor, context) {
    if (!context?.isAuth) throw new Error("Error retrieving Floor data. You are not authenticated.")
    this.context = context
    this.floor = floor

    this.id = floor.id
    this.name = floor.name
    // const nodes = []
    // for(const [id, node] of floor.nodes) {
    //   const newNode = {
    //     id: node.id,
    //     ui: node.ui,  
    //     state: node.state,
    //     isExit: node.isExit,
    //     connections: node.connections,
    //     name: id
    //   }
    //   nodes.push(new Node(newNode, this.context))
    // }
    // this.nodes = nodes
    this.image = floor.image
    this.createdAt = floor.createdAt
    this.updatedAt = floor.updatedAt
  }

  async building() {
    const buildingId = this.floor.building
    const building = await Building.build(buildingId, this.context)
    return building
  }

  async nodes() {
    const nodes = []
    for (const nodeId of this.floor.nodes) {
      try {
        const node = await Node.build(nodeId, this.context)
        nodes.push(node)
      } catch (e) {
        continue
      }
    }
    return nodes
  }
}
