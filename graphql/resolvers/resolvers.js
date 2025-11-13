// Mutations
import { createBuilding } from "./mutation/createBuilding"
import { createFloor } from "./mutation/createFloor"
import { updateFloorPlan } from "./mutation/updateFloorPlan"
import { createUser } from "./mutation/createUser"
import { updateBuilding } from "./mutation/updateBuilding"
import { updateFloor } from "./mutation/updateFloor"
import { updateNode } from "./mutation/updateNode"

// Queries
import { deleteImage } from "./query/deleteImage"
import { generateSignature } from "./query/generateSignature"
import { getBuilding } from "./query/getBuilding"
import { getBuildings } from "./query/getBuildings"
import { getFloor } from "./query/getFloor"
import { getFloorPlan } from "./query/getFloorPlan"
import { getFloors } from "./query/getFloors"
import { getLogs } from "./query/getLogs"
import { loginUser } from "./query/loginUser"
import { logoutUser } from "./query/logoutUser"
import { validateSession } from "./query/validateSession"

// Subscriptions
import { buildingUpdate } from "./subscription/buildingUpdate"
import { buildingUpdates } from "./subscription/buildingUpdates"
import { floorUpdate } from "./subscription/floorUpdate"
import { nodeUpdate } from "./subscription/nodeUpdate"
import { sendHello } from "./subscription/sendHello"

// Resolver
export default {
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
