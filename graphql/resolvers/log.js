import { model } from "mongoose"
import { logSchema } from "../../models/log"

import Building from "./building"
import Floor from "./floor"
import { build as _build } from "./node"

const LogModel = model("Log", logSchema)

export default class Log {

  static async build(logId, context) {
    if (!context?.isAuth) throw new Error("Error retrieving Node data. You are not authenticated.")

    const log = await LogModel.findById(logId)
    if (!log) {
      throw new Error(`Log ${logId} not found`)
    }

    return new Log(log, context)
  }

  constructor(log, context) {
    if (!context?.isAuth) throw new Error("Error retrieving Node data. You are not authenticated.")
    this.context = context
    this.log = log
    this.id = log.id || ""
    this.message = log.message
    this.type = log.type
    this.priority = log.priority
    this.updatedAt = log.updatedAt
    this.createdAt = log.createdAt
  }

  async buildings() {
    const buildings = []
    for (const buildingId of this.log.buildings) {
      const building = await Building.build(buildingId, this.context)
      buildings.push(building)
    }
    return buildings
  }

  async floors() {
    const floors = []
    for (const floorId of this.log.floors) {
      const floor = await Floor.build(floorId, this.context)
      floors.push(floor)
    }
    return floors
  }

  async nodes() {
    const nodes = []
    for (const nodeId of this.log.nodes) {
      const node = await _build(nodeId, this.context)
      nodes.push(node)
    }
    return nodes
  }
}
