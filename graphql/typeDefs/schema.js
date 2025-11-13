import { buildSchema } from "graphql";

import * as createBuilding from "./mutation/createBuilding.js";
import * as createFloor from "./mutation/createFloor.js";
import * as createUser from "./mutation/createUser.js";
import * as updateBuilding from "./mutation/updateBuilding.js";
import * as updateFloor from "./mutation/updateFloor.js";
import * as updateFloorPlan from "./mutation/updateFloorPlan.js";
import * as updateNode from "./mutation/updateNode.js";

import * as deleteImage from "./query/deleteImage.js";
import * as generateSignature from "./query/generateSignature.js";
import * as getBuilding from "./query/getBuilding.js";
import * as getBuildings from "./query/getBuildings.js";
import * as getFloor from "./query/getFloor.js";
import * as getFloorPlan from "./query/getFloorPlan.js";
import * as getFloors from "./query/getFloors.js";
import * as getLogs from "./query/getLogs.js";
import * as loginUser from "./query/loginUser.js";
import * as logoutUser from "./query/logoutUser.js";
import * as validateSession from "./query/validateSession.js";

import * as buildingUpdate from "./subscription/buildingUpdate.js";
import * as buildingUpdates from "./subscription/buildingUpdates.js";
import * as floorUpdate from "./subscription/floorUpdate.js";
import * as nodeUpdate from "./subscription/nodeUpdate.js";
import * as sendHello from "./subscription/sendHello.js";

import * as building from "./building.js";
import * as floor from "./floor.js";
import * as floorPlan from "./floorPlan.js";
import * as floorImage from "./floorImage.js";
import * as hello from "./hello.js";
import * as invisibleNode from "./invisibleNode.js";
import * as log from "./log.js";
import * as login from "./login.js";
import * as logOutput from "./logOutput.js";
import * as node from "./node.js";
import * as nodeUI from "./nodeUI.js";
import * as signature from "./signature.js";
import * as status from "./status.js";
import * as user from "./user.js";

import * as buildingInput from "./buildingInput.js";
import * as floorImageInput from "./floorImageInput.js";
import * as floorInput from "./floorInput.js";
import * as nodeInput from "./nodeInput.js";
import * as nodeUIInput from "./nodeUIInput.js";
import * as logInput from "./logInput.js";

export const schema = buildSchema(`
  type Mutation {
    ${createBuilding.schema}
    ${createFloor.schema}
    ${createUser.schema}
    ${updateBuilding.schema}
    ${updateFloor.schema}
    ${updateFloorPlan.schema}
    ${updateNode.schema}
  }

  type Query {
    ${deleteImage.schema}
    ${generateSignature.schema}
    ${getBuilding.schema}
    ${getBuildings.schema}
    ${getFloor.schema}
    ${getFloorPlan.schema}
    ${getFloors.schema}
    ${getLogs.schema}
    ${loginUser.schema}
    ${validateSession.schema}
    ${logoutUser.schema}
  }

  type Subscription {
    ${buildingUpdate.schema}
    ${buildingUpdates.schema}
    ${floorUpdate.schema}
    ${nodeUpdate.schema}
    ${sendHello.schema}
  }

  ${buildingInput.createBuildingInput.schema}
  ${buildingInput.updateBuildingInput.schema}
  ${floorImageInput.schema}
  ${floorInput.createFloorInput.schema}
  ${floorInput.updateFloorInput.schema}
  ${logInput.schema}
  ${nodeInput.createNodeInput.schema}
  ${nodeInput.nodeReferenceInput.schema}
  ${nodeInput.updateNodeInput.schema}
  ${nodeUIInput.schema}

  ${building.schema}
  ${floor.schema}
  ${floorPlan.schema}
  ${floorImage.schema}
  ${hello.schema}
  ${invisibleNode.schema}
  ${log.schema}
  ${login.schema}
  ${logOutput.schema}
  ${node.schema}
  ${nodeUI.schema}
  ${signature.schema}
  ${status.schema}
  ${user.schema}
`)
