import mongoose from "mongoose"
const { model, Types: { ObjectId } } = mongoose
import { nodeSchema } from "../../../models/node.js"
const NodeModel = model("Node", nodeSchema)

import Node from "../node.js"
import Floor from "../floor.js"

import { createLog, formatModel, updateLog } from "../../../utils/createLog.js"

// Work on adding the invisibleNodes logic to the node update
export async function updateNode({
  updateNodeInput: { id, name, state, isExit, ui, isDeleted }
}, context) {
  if (!context?.isAuth) throw new Error("Error updating Node. You are not authenticated.")
  try {
    if (isDeleted) {
      const node = await NodeModel.findOneAndDelete({
        _id: new ObjectId(`${id}`)
      })
      const currentFloor = await Floor.build(node.floor, context)
      const currentBuilding = await currentFloor.building()
      updateLog("node", node.id, node.name)
      createLog("NODE_DELETED", `Node ${node.name} on ${formatModel(currentFloor, "floor", "Floor")} has been deleted`, {
        floors: [currentFloor.id],
        buildings: [currentBuilding.id]
      })
      return null
    }

    if (!node) {
      throw new Error("Node not found")
    }

    const node = await NodeModel.findById(id)
    const currentFloor = await Floor.build(node.floor, context)
    const currentBuilding = await currentFloor.building()
    const logs = [], updateLogs = []

    if (name?.length && name !== node.name) {
      const oldName = node.name
      node.name = name
      updateLogs.push(["node", node.id, oldName, node.name])
      logs.push(["NODE_NAME_CHANGE", `Node ${oldName} on ${formatModel(currentFloor, "floor", "Floor")} has been renamed to ${formatModel(node, "node")}`, {
        buildings: [currentBuilding.id],
        floors: [currentFloor.id],
        nodes: [node.id]
      }])
    }
    if (state?.length && state !== node.state) {
      switch (state) {
        case "safe":
          logs.push(["NODE_SAFE", `${formatModel(node, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")} is now safe`, {
            buildings: [currentBuilding.id],
            floors: [currentFloor.id],
            nodes: [node.id]
          }])
          break
        case "stuck":
          logs.push(["NODE_STUCK", `There is currently no way out from ${formatModel(node, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")}`, {
            buildings: [currentBuilding.id],
            floors: [currentFloor.id],
            nodes: [node.id]
          }])
          break
        case "compromised":
          logs.push(["NODE_COMPROMISED", `${formatModel(node, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")} has detected fire!`, {
            buildings: [currentBuilding.id],
            floors: [currentFloor.id],
            nodes: [node.id]
          }])
          break
        default:
          logs.push(["NODE_STATE_CHANGE", `${formatModel(node, "node", "Node")} state has been changed on ${formatModel(currentFloor, "floor", "Floor")}`, {
            buildings: [currentBuilding.id],
            floors: [currentFloor.id],
            nodes: [node.id]
          }])
          break
      }
      node.state = state
      // Keep different states for on fire, stuck and stuff like that
    }
    if (typeof isExit === "boolean" && isExit != node.isExit) {
      logs.push(["NODE_EXIT", `${formatModel(node, "node", "Node")} has been assigned as an exit on ${formatModel(currentFloor, "floor", "Floor")}`, {
        buildings: [currentBuilding.id],
        floors: [currentFloor.id],
        nodes: [node.id]
      }])
      node.isExit = isExit
    }
    if (ui && (ui?.x !== node.ui.x || ui?.y !== node.ui.y)) {
      logs.push(["NODE_LOCATION_CHANGED", `${formatModel(node, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")} has been moved`, {
        buildings: [currentBuilding.id],
        floors: [currentFloor.id],
        nodes: [node.id]
      }])
      node.ui = ui
    }
    await node.save()

    for (const [modelType, id, oldName, newName] of updateLogs) {
      updateLog(modelType, id, oldName, newName)
    }
    for (const [type, message, ids] of logs) {
      createLog(type, message, ids)
    }

    return new Node(node, context)
  } catch (err) {
    console.log(err)
    return null
  }

}
