// Mutations
import { createBuilding } from "./mutation/createBuilding.js"
import { createFloor } from "./mutation/createFloor.js"
import { updateFloorPlan } from "./mutation/updateFloorPlan.js"
import { createUser } from "./mutation/createUser.js"
import { updateBuilding } from "./mutation/updateBuilding.js"
import { updateFloor } from "./mutation/updateFloor.js"
import { updateNode } from "./mutation/updateNode.js"

// Queries
import { deleteImage } from "./query/deleteImage.js"
import { generateSignature } from "./query/generateSignature.js"
import { getBuilding } from "./query/getBuilding.js"
import { getBuildings } from "./query/getBuildings.js"
import { getFloor } from "./query/getFloor.js"
import { getFloorPlan } from "./query/getFloorPlan.js"
import { getFloors } from "./query/getFloors.js"
import { getLogs } from "./query/getLogs.js"
import { loginUser } from "./query/loginUser.js"
import { logoutUser } from "./query/logoutUser.js"
import { validateSession } from "./query/validateSession.js"

// Subscriptions
import { buildingUpdate } from "./subscription/buildingUpdate.js"
import { buildingUpdates } from "./subscription/buildingUpdates.js"
import { floorUpdate } from "./subscription/floorUpdate.js"
import { nodeUpdate } from "./subscription/nodeUpdate.js"
import { sendHello } from "./subscription/sendHello.js"

// Resolver
export const resolvers = {
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
