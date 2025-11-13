import mongoose from "mongoose"
const { model, Types: { ObjectId } } = mongoose
import { buildingSchema } from "../../../models/building"
import { floorSchema } from "../../../models/floor"
import { nodeSchema } from "../../../models/node"
const BuildingModel = model("Building", buildingSchema)
const FloorModel = model("Floor", floorSchema)
const NodeModel = model("Node", nodeSchema)

import Floor from "../floor"
import Building from "../building"
import { createLog, formatModel, updateLog } from "../../../utils/createLog"
import deleteImage from "../../../utils/deleteImage"

export async function createFloor({
  createFloorInput: { name, id, buildingId, image, isDeleted, nodes }
}, context) {
  if (!context?.isAuth) throw new Error("Error creating Building. You are not authenticated.")
  try {
    // Add logs later, focus on logic
    // For logs
    let floor
    if (!id) {
      if (!buildingId) throw new Error("Error creating Floor. No building ID provided.")
      floor = new FloorModel({ name, building: buildingId, image })
    } else if (isDeleted) {
      // Check middleware to make sure this is handled
      floor = await FloorModel.findOneAndDelete({ _id: new ObjectId(`${id}`) })
      const building = await BuildingModel.findById(floor.building.toString())
      if (!building) throw new Error("Building not found")
      const currentBuilding = new Building(building, context)

      updateLog("floor", floor.id, floor.name)
      createLog("FLOOR_DELETED", `Floor ${floor.name} on ${formatModel(currentBuilding, "building", "Building")} has been deleted`,
        {
          buildings: [currentBuilding.id]
        })
      // Update log for deleted floor
      // Create log for deleted floor
      return null
    } else {
      floor = await FloorModel.findById(id)
    }

    const building = await BuildingModel.findById(floor.building.toString())
    if (!building) throw new Error("Building not found")
    const currentFloor = new Floor(floor, context)
    const currentBuilding = new Building(building, context)

    // Now we have the floor
    const logs = [], updateLogs = []
    if (name?.length && name !== floor.name) {
      const oldName = floor.name
      floor.name = name
      updateLogs.push(["floor", floor.id, oldName, floor.name])
      logs.push(["FLOOR_NAME_CHANGE", `Floor ${oldName} on ${formatModel(currentBuilding, "building", "Building")} has been renamed to ${formatModel(floor, "floor")}`])
    }

    if (buildingId?.length && buildingId !== floor.building._id.toString()) {
      try {
        const newBuilding = await Building.build(buildingId, context)
        logs.push(["FLOOR_RELOCATED", `${formatModel(floor, "floor", "Floor")} has been moved to ${formatModel(newBuilding, "building", "Building")} from ${formatModel(currentBuilding, "building", "Building")} `, {
          buildings: [currentBuilding.id, newBuilding.id],
          floors: [floor.id]
        }])
      } catch {
        console.log("Building id didn't exist so I'll wait for it to fail")
      }
      floor.building = buildingId
    }

    if (
      (image?.url && image.url !== floor?.image?.url) ||
      (image?.position && (image.position[0] !== floor?.image?.position[0] || image.position[1] !== floor?.image?.position[1])) ||
      (image?.scale && (image.scale[0] !== floor?.image?.scale[0] || image.scale[1] !== floor?.image?.scale[1]))
    ) {
      logs.push(["FLOOR_IMAGE_UPLOADED", `A new image has been uploaded to ${formatModel(floor, "floor", "Floor")} in ${formatModel(currentBuilding, "building", "Building")}`, {
        buildings: [currentBuilding.id],
        floors: [floor.id]
      }])
    }

    if (image?.url && image.url !== floor?.image?.url) {
      const publicId = floor?.image?.url?.split('/').pop().split('.')[0]
      deleteImage(publicId)
      floor.image.url = image.url
    }

    if (image?.position?.length === 2 && (image.position[0] !== floor?.image?.position[0] || image.position[1] !== floor?.image?.position[1])) {
      floor.image.position = image.position
    }

    if (image?.scale && (image.scale[0] !== floor?.image?.scale[0] || image.scale[1] !== floor?.image?.scale[1])) {
      floor.image.scale = image.scale
    }

    if (image?.name && image.name !== floor?.image?.name) {
      floor.image.name = image.name
    }

    const nodeMap = new Map()
    const deletedNodes = new Set()
    const currentNodes = await NodeModel.find({ floor: floor._id })

    for (const node of currentNodes) {
      // Name could change
      nodeMap.set(node.name, node)
    }

    for (const node of nodes) {
      // Figure out a way to make sure names are unique
      // Both client and server
      if (node.operation === "update") {
        const currentNode = currentNodes.find(n => n._id.toString() === node.id)
        if (currentNode.name !== node.name) {
          const oldName = currentNode.name
          currentNode.name = node.name
          nodeMap.delete(oldName)
          nodeMap.set(node.name, currentNode)

          updateLogs.push(["node", node.id, oldName, node.name])
          logs.push(["NODE_NAME_CHANGE", `Node ${oldName} on ${formatModel(currentFloor, "floor", "Floor")} has been renamed to ${formatModel(node, "node")}`, {
            buildings: [currentBuilding.id],
            floors: [currentFloor.id],
            nodes: [node.id]
          }])
        }
        if (node?.state?.length && currentNode.state !== node.state) {
          switch (node.state) {
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
          currentNode.state = node.state
        }

        if (node.isExit === !!node.isExit && currentNode.isExit !== node.isExit) {
          logs.push(["NODE_EXIT", `${formatModel(node, "node", "Node")} has been assigned as an exit on ${formatModel(currentFloor, "floor", "Floor")}`, {
            buildings: [currentBuilding.id],
            floors: [currentFloor.id],
            nodes: [node.id]
          }])
          currentNode.isExit = node.isExit
        }
        if (!isNaN(node?.ui?.x) && !isNaN(node?.ui?.y) && (currentNode?.ui?.x !== node?.ui?.x || currentNode?.ui?.y !== node?.ui?.y)) {
          logs.push(["NODE_LOCATION_CHANGED", `${formatModel(node, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")} has been moved`, {
            buildings: [currentBuilding.id],
            floors: [currentFloor.id],
            nodes: [node.id]
          }])
          currentNode.ui = node.ui
        }
        // Update log for updated node
        // Add log for updated node
      } else if (!nodeMap.has(node.name) || node.operation === "create") {
        const newNode = new NodeModel({
          name: node.name,
          state: node.state,
          isExit: node.isExit,
          ui: node.ui,
          floor: floor._id,
          connections: []
        })
        // Add log for new node
        nodeMap.set(node.name, newNode)
        floor.nodes = floor.nodes.filter(n => newNode._id.toString() !== n._id.toString())
        floor.nodes.push(newNode._id)

        createLog("NODE_CREATED", `${formatModel(newNode, "node", "Node")} has been created on ${formatModel(currentFloor, "floor", "Floor")}`, {
          buildings: [currentBuilding.id],
          floors: [currentFloor.id],
          nodes: [newNode.id]
        })
      } else if (node.operation === "delete") {
        deletedNodes.add(node.name)

        updateLog("node", node.id, node.name)
        createLog("NODE_DELETED", `Node ${node.name} on ${formatModel(currentFloor, "floor", "Floor")} has been deleted`,
          {
            floors: [currentFloor.id],
            buildings: [currentBuilding.id]
          })
        // Maybe do this when you actually delete the nodes
        // Update log for deleted node
        // Add log for deleted node
      }
    }

    // Connection logic
    for (const node of nodes) {
      const currentNode = nodeMap.get(node.name)
      if (node?.connections?.length) for (const connection of node.connections) {
        // connection -> id, name, direction
        const otherNode = nodeMap.get(connection.name)
        const firstNodeConnection = currentNode.connections.find(c => c.id.toString() === otherNode.id.toString())
        const secondNodeConnection = otherNode.connections.find(c => c.id.toString() === currentNode.id.toString())

        if (connection.direction === "xy") {
          // Running this only on xy to make sure we don't double connect
          currentNode.connections = currentNode.connections.filter(c => c.id.toString() !== otherNode.id.toString())
          otherNode.connections = otherNode.connections.filter(c => c.id.toString() !== currentNode.id.toString())
          currentNode.connections.push({
            id: otherNode.id,
            direction: "xy"
          })
          otherNode.connections.push({
            id: currentNode.id,
            direction: "yx"
          })

          if (!firstNodeConnection || !secondNodeConnection) {
            createLog("NODES_CONNECTED", `${formatModel(currentNode, "node", "Node")} has been connected to ${formatModel(otherNode, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")}`, {
              buildings: [currentBuilding.id],
              floors: [currentFloor.id],
              nodes: [currentNode.id, otherNode.id]
            })
          }
        } else if (connection.direction === "") {
          // If there is no connection,make sure of it
          currentNode.connections = currentNode.connections.filter(c => c.id.toString() !== otherNode.id.toString())
          otherNode.connections = otherNode.connections.filter(c => c.id.toString() !== currentNode.id.toString())
          // If the connection existed to begin with, log the disconnection
          if (firstNodeConnection && secondNodeConnection && firstNodeConnection.direction === "xy") {
            createLog("NODES_DISCONNECTED", `${formatModel(currentNode, "node", "Node")} has been disconnected from ${formatModel(otherNode, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")}`, {
              buildings: [currentBuilding.id],
              floors: [currentFloor.id],
              nodes: [currentNode.id, otherNode.id]
            })
          }
        }
      }
    }
    for (const node of nodeMap.values()) {
      if (deletedNodes.has(node.name)) {
        floor.nodes = floor.nodes.filter(n => node._id.toString() !== n._id.toString())
        const deletedNode = await NodeModel.findOneAndDelete({
          _id: node._id
        })
      } else {
        await node.save()
      }
    }

    for (const [modelType, id, oldName, newName] of updateLogs) {
      updateLog(modelType, id, oldName, newName)
    }
    for (const [type, message, ids] of logs) {
      createLog(type, message, ids)
    }

    await floor.save()
    floor = await Floor.build(floor.id, context)
    // TODO: Create the logs in logs, and updateLogs!
    return floor
  } catch (e) {
    console.log(e)
    return null
  }
}
