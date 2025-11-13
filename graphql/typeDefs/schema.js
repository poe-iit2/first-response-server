import { buildSchema } from "graphql";

import * as createBuilding from "./mutation/createBuilding";
import * as createFloor from "./mutation/createFloor";
import * as createUser from "./mutation/createUser";
import * as updateBuilding from "./mutation/updateBuilding";
import * as updateFloor from "./mutation/updateFloor";
import * as updateFloorPlan from "./mutation/updateFloorPlan";
import * as updateNode from "./mutation/updateNode";

import * as deleteImage from "./query/deleteImage";
import * as generateSignature from "./query/generateSignature";
import * as getBuilding from "./query/getBuilding";
import * as getBuildings from "./query/getBuildings";
import * as getFloor from "./query/getFloor";
import * as getFloorPlan from "./query/getFloorPlan";
import * as getFloors from "./query/getFloors";
import * as getLogs from "./query/getLogs";
import * as loginUser from "./query/loginUser";
import * as logoutUser from "./query/logoutUser";
import * as validateSession from "./query/validateSession";

import * as buildingUpdate from "./subscription/buildingUpdate";
import * as buildingUpdates from "./subscription/buildingUpdates";
import * as floorUpdate from "./subscription/floorUpdate";
import * as nodeUpdate from "./subscription/nodeUpdate";
import * as sendHello from "./subscription/sendHello";

import * as building from "./building";
import * as floor from "./floor";
import * as floorPlan from "./floorPlan";
import * as floorImage from "./floorImage";
import * as hello from "./hello";
import * as invisibleNode from "./invisibleNode";
import * as log from "./log";
import * as login from "./login";
import * as logOutput from "./logOutput";
import * as node from "./node";
import * as nodeUI from "./nodeUI";
import * as signature from "./signature";
import * as status from "./status";
import * as user from "./user";

import { createBuildingInput, updateBuildingInput } from "./buildingInput";
import * as floorImageInput from "./floorImageInput";
import { createFloorInput, updateFloorInput } from "./floorInput";
import { createNodeInput, nodeReferenceInput, updateNodeInput } from "./nodeInput";
import * as nodeUIInput from "./nodeUIInput";
import * as logInput from "./logInput";

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
