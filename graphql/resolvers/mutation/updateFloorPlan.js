// Change this to update floor in the future
// Work on adding floorInput too (updateFloorInput and createFloorInput)

// Logic for connections and stuffs like that
const { model, Types: { ObjectId } } = require("mongoose")
const { nodeSchema } = require("../../../models/node")

const NodeModel = model("Node", nodeSchema )

const { invisibleNodeSchema } = require("../../../models/invisibleNode")
const InvisibleNodeModel = model("InvisibleNode", invisibleNodeSchema )

// Keep checks in place to prevent duplicate invisible nodes from being created

/*
connections{
  connectedNodes{} -> [{node_id/node_name, deleted or not, direction}]
*/


// Commenting for sanity
// TODO: Use chatgpt later

const FloorPlan = require("../floorPlan")
const {
  createLog,
  formatModel,
  updateLog
} = require("../../../utils/createLog")
const Floor = require("../floor")

const { floorSchema } = require("../../../models/floor")
const FloorModel = model("Floor", floorSchema)

// Remember to change the function to updateFloor

// Main function... it's downhill from here
const updateFloorPlan = async ({
  createNodeInputs, // Check the schema to know what you're dealing with
  updateNodeInputs,
  id
}, context) => {
  // Auth check. Create a function wrapper sometime in the future for this
  if(!context?.isAuth) throw new Error("Error creating Node. You are not authenticated.")

  // Array of Node resolvers to be returned
  // Mapping name of new nodes to the newly created nodes
  const nameMap = new Map()
  const deletedNodes = new Set()
  // Work on keeping this in functions since they are reused (updateNode e.t.c)
  const currentFloor = await Floor.build(id, context)
  const floor = await FloorModel.findById(id)
  const currentBuilding = await currentFloor.building()
  for(const {id, name, state, isExit, ui, isDeleted} of updateNodeInputs) {
    const logs = [], updateLogs = []
    if(isDeleted){
      const node = await NodeModel.findById(id)
      updateLog("node", node.id, node.name)
      createLog("NODE_DELETED", `Node ${node.name} on ${formatModel(currentFloor, "floor", "Floor")} has been deleted`,
      {
        floors: [currentFloor.id],
        buildings: [currentBuilding.id]
      })
      nameMap.set(node.name, node)
      deletedNodes.add(node.id)
      // Create a logic to update the node logs on delete and when the name's been updated
      continue
    }
    const node = await NodeModel.findById(id)

    if(!node) throw new Error("Node not found")

    if(name?.length && name !== node.name) {
      const oldName = node.name
      node.name = name
      updateLogs.push(["node", node.id, oldName, node.name])
      logs.push(["NODE_NAME_CHANGE", `Node ${oldName} on ${formatModel(currentFloor, "floor", "Floor")} has been renamed to ${formatModel(node, "node")}`, {
        buildings: [currentBuilding.id],
        floors: [currentFloor.id],
        nodes: [node.id]
      }])
    }
    if(state?.length && state !== node.state){
      switch(state){
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
    if(typeof isExit === "boolean" && isExit != node.isExit){
      logs.push(["NODE_EXIT", `${formatModel(node, "node", "Node")} has been assigned as an exit on ${formatModel(currentFloor, "floor", "Floor")}`, {
        buildings: [currentBuilding.id],
        floors: [currentFloor.id],
        nodes: [node.id]
      }])
      node.isExit = isExit
    }
    if(ui && (ui?.x !== node.ui.x || ui?.y !== node.ui.y)){
      logs.push(["NODE_LOCATION_CHANGED", `${formatModel(node, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")} has been moved`, {
        buildings: [currentBuilding.id],
        floors: [currentFloor.id],
        nodes: [node.id]
      }])
      node.ui = ui
    }

    for(const [modelType, id, oldName, newName] of updateLogs)updateLog(modelType, id, oldName, newName)

    for(const [type, message, ids] of logs)createLog(type, message, ids)
    nameMap.set(node.name, node)
  }

  // This guy creates the new nodes and adds them to the nodes array
  for(const nodeInput of createNodeInputs) {
    let node = await NodeModel.findOne({ name: nodeInput.name, floor: id })

    if(node) throw new Error("Node already exists")
    
    const args = {name: nodeInput.name, floor: id, connections: []}

    if(nodeInput.state) args.state = nodeInput.state
    if(nodeInput.isExit) args.isExit = nodeInput.isExit
    else args.isExit = false
    if(nodeInput.ui) args.ui = nodeInput.ui

    node = new NodeModel(args)

    createLog("NODE_CREATED", `${formatModel(node, "node", "Node")} has been created on ${formatModel(currentFloor, "floor", "Floor")}`, {
      buildings: [currentBuilding.id],
      floors: [currentFloor.id],
      nodes: [node.id]
    })
  
    nameMap.set(node.name, node)
  }

  const handleConnections = (name, connections) => {
    const node = nameMap.get(name)
    if(!node)return
    for(const connection of connections) {
      // No need to do for both xy and yx
      if(connection.direction === "yx")continue
      const otherNode = nameMap.get(connection.name)
      if(!otherNode) continue
      console.log("node Connections", node.connections)
      console.log(node.id, otherNode.id)
      const oldConnection = node.connections.find(connection => connection.id.toString() === otherNode.id)
      console.log("oldConnection", oldConnection)
      if(oldConnection && oldConnection.direction === connection.direction){
        continue
      }else{
        node.connections = node.connections.filter(connection => connection.id.toString() !== otherNode.id.toString())
        otherNode.connections = otherNode.connections.filter(connection => connection.id.toString() !== node.id.toString())
        if(connection.direction === "") {
          // If the connection existed to begin with, log the disconnection
          if(oldConnection){
            createLog("NODES_DISCONNECTED", `${formatModel(node, "node", "Node")} has been disconnected from ${formatModel(node, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")}`, {
              buildings: [currentBuilding.id],
              floors: [currentFloor.id],
              nodes: [node.id, otherNode.id]
            })
          }
        }else{
          node.connections.push({
            id: otherNode.id,
            direction: connection.direction
          })
          otherNode.connections.push({
            id: node.id,
            direction: connection.direction === "xy" ? "yx" : "xy"
          })
          if(!oldConnection){
            createLog("NODES_CONNECTED", `${formatModel(node, "node", "Node")} has been connected to ${formatModel(otherNode, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")}`, {
              buildings: [currentBuilding.id],
              floors: [currentFloor.id],
              nodes: [node.id, otherNode.id]
            })
          }
        }
      }
    }
  }

  for(const { name, connections } of updateNodeInputs) {
    handleConnections(name, connections)
  }

  for(const { name, connections } of createNodeInputs) {
    handleConnections(name, connections)
  }

  for(const [_, node] of nameMap) {
    if(deletedNodes.has(node.id)){
      await NodeModel.findOneAndDelete({ _id: node._id })
      floor.nodes = floor.nodes.filter(node => node._id.toString() !== node.id.toString())
      continue
    }
    await node.save()
    await floor.save()
  }

  // For each invisible node
  // You create the invisible node
  // Replace the connections with the actual id of the connected node
  // Update the nodes to reflect that they are connected to the invisible node
  // Also figure out a way to make sure connections has only two nodes, using an array is lazy and sloppy
  // create functions for repeated logic to make code less lengthy
  
  // for(const invisibleNodeInput of updateInvisibleNodeInputs) {
  //   if(invisibleNodeInput.isDeleted){
  //     let invisibleNode = await InvisibleNodeModel.findOneAndDelete({
  //       _id: new ObjectId(`${invisibleNodeInput.id}`)
  //     })
  //     invisibleNode = new InvisibleNode(invisibleNode, context)
  //     const [firstNode, secondNode] = await invisibleNode.connectedNodes()
  //     createLog("NODES_DISCONNECTED", `${formatModel(firstNode, "node", "Node")} has been disconnected from ${formatModel(secondNode, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")}`, {
  //       buildings: [currentBuilding.id],
  //       floors: [currentFloor.id],
  //       nodes: [firstNode.id, secondNode.id]
  //     })
  //     return
  //   }
  //   const invisibleNode = await InvisibleNodeModel.findById(invisibleNodeInput.id)

  //   if(!invisibleNode) throw new Error("Invisible Node not found")
    

  //   if("connections" in invisibleNodeInput){
  //     const connections = invisibleNodeInput.connections

  //     if(connections?.length !== 2){
  //       throw new Error("Expected two Nodes in connections array")
  //     }

  //     if(connections[0]?.id){
  //       connections[0] = connections[0].id
  //     }else if(connections[0]?.name){
  //       const nodeName = connections[0].name
  //       if(!nameMap.has(nodeName))throw new Error("Referenced Node was not found")

  //       connections[0] = nameMap.get(nodeName).id
  //     }else{
  //       throw new Error("Invisible Node expects an id or name of connected Node.")
  //     }

  //     if(connections[1]?.id){
  //       connections[1] = connections[1].id
  //     }else if(connections[1]?.name){
  //       const nodeName = connections[1].name
  //       if(!nameMap.has(nodeName))throw new Error("Referenced Node was not found")

  //       connections[1] = nameMap.get(nodeName).id
  //     }else{
  //       throw new Error("Invisible Node expects an id or name of connected Node.")
  //     }

  //     invisibleNode.connectedNodes = connections
  //     await invisibleNode.save()
  //   }
  // }

  // for(const invisibleNodeInput of createInvisibleNodeInputs) {
  //   const invisibleNode = new InvisibleNodeModel({})
    
  //   const connections = invisibleNodeInput.connections

  //   if(connections?.length !== 2){
  //     throw new Error("Expected two Nodes in connections array")
  //   }

  //   if(connections[0]?.id){
  //     connections[0] = connections[0].id
  //   }else if(connections[0]?.name){
  //     const nodeName = connections[0].name
  //     if(!nameMap.has(nodeName))throw new Error("Referenced Node was not found")

  //     connections[0] = nameMap.get(nodeName).id
  //   }else{
  //     throw new Error("Invisible Node expects an id or name of connected Node.")
  //   }

  //   if(connections[1]?.id){
  //     connections[1] = connections[1].id
  //   }else if(connections[1]?.name){
  //     const nodeName = connections[1].name
  //     if(!nameMap.has(nodeName))throw new Error("Referenced Node was not found")

  //     connections[1] = nameMap.get(nodeName).id
  //   }else{
  //     throw new Error("Invisible Node expects an id or name of connected Node.")
  //   }

  //   invisibleNode.connectedNodes = connections
  //   await invisibleNode.save()
  //   const resolvedInvisibleNode = new InvisibleNode(invisibleNode, context)
  //   const [firstNode, secondNode] = await resolvedInvisibleNode.connectedNodes()
  //   createLog("NODES_CONNECTED", `${formatModel(firstNode, "node", "Node")} has been connected to ${formatModel(secondNode, "node", "Node")} on ${formatModel(currentFloor, "floor", "Floor")}`, {
  //     buildings: [currentBuilding.id],
  //     floors: [currentFloor.id],
  //     nodes: [firstNode.id, secondNode.id]
  //   })

  // }

  const floorPlan = await FloorPlan.build(id, context)

  return floorPlan
}

// Create a database for invisible nodes
// Every new node comes with it's own set of invisible nodes
// Let's assume every

module.exports = {
  updateFloorPlan
}