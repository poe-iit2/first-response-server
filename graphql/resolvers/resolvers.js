// Mutations
const { createBuilding } = require("./mutation/createBuilding")
const { createFloor } = require("./mutation/createFloor")
const { updateFloorPlan } = require("./mutation/updateFloorPlan")
const { createUser } = require("./mutation/createUser")
const { updateBuilding } = require("./mutation/updateBuilding")
const { updateFloor } = require("./mutation/updateFloor")
const { updateNode } = require("./mutation/updateNode")

// Queries
const { deleteImage } = require("./query/deleteImage")
const { generateSignature } = require("./query/generateSignature")
const { getBuilding } = require("./query/getBuilding")
const { getBuildings } = require("./query/getBuildings")
const { getFloor } = require("./query/getFloor")
const { getFloorPlan } = require("./query/getFloorPlan")
const { getFloors } = require("./query/getFloors")
const { getLogs } = require("./query/getLogs")
const { loginUser } = require("./query/loginUser")
const { logoutUser } = require("./query/logoutUser")
const { validateSession } = require("./query/validateSession")

// Subscriptions
const { buildingUpdate } = require("./subscription/buildingUpdate")
const { buildingUpdates } = require("./subscription/buildingUpdates")
const { floorUpdate } = require("./subscription/floorUpdate")
const { nodeUpdate } = require("./subscription/nodeUpdate")
const { sendHello } = require("./subscription/sendHello")

// Resolver
const resolvers = {
  createBuilding,
  createFloor,
  createUser,
  updateBuilding,
  updateFloor,
  updateFloorPlan,
  updateNode,
  deleteImage,
  generateSignature,
  getBuilding,
  getBuildings,
  getFloor,
  getFloorPlan,
  getFloors,
  getLogs,
  loginUser,
  logoutUser,
  validateSession,
  subscription: {
    buildingUpdate,
    buildingUpdates,
    floorUpdate,
    nodeUpdate,
    sendHello
  }
}

module.exports = {
  resolvers
}