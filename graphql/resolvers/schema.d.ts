import { ID } from "graphql-ws"

import Log from "./log"
import Building from "./building"
import Floor from "./floor"
import FloorPlan from "./floorPlan"
import User from "./user"
import Status from "./status"

interface CreateBuildingInput {
    name: string
}

interface UpdateBuildingInput {
    id: ID,
    name: string,
    isDeleted: boolean
}

interface FloorImage {
    name: string,
    url: string,
    position: Array<number>,
    scale: Array<number>
}

interface FloorImageInput {
    name: string,
    url: string,
    position: Array<number>,
    scale: Array<number>
}

interface CreateFloorInput {
    id: ID,
    name: string,
    buildingId: ID,
    image: FloorImageInput,
    isDeleted: boolean,
    nodes: Array<UpdateNodeInput>
}

interface UpdateFloorInput {
    id: ID,
    name: string,
    image: FloorImageInput,
    buildingId: string,
    isDeleted: boolean,
}

interface InvisibleNode {
    id: ID,
    connectedNodes: Array<Node>,
    createdAt: string,
    updatedAt: string,
}

// interface Log {
//     id: string,
//     type: string,
//     message: string,
//     buildings: Array<Building>,
//     floors: Array<Floor>,
//     nodes: Array<Node>,
//     priority: number,
//     updatedAt: string,
//     createdAt: string,
// }

interface Login {
    token: string,
    user: User,
    expiresIn: Date,
}

interface LogInput {
    status: Array<string>,
    nodes: Array<string>,
    floors: Array<string>,
    buildings: Array<string>,
    page: number,
    pageCount: number,
    date: number,
}

interface LogOutput {
    logs: Array<Log>,
    totalCount: number
}

interface Node {
    id: string,
    name: string,
    state: string,
    isExit: boolean,
    connections: Array<Node>,
    floor: Floor,
    ui: NodeUI,
    updatedAt: string,
    createdAt: string,
    direction: string,
}
interface CreateNodeInput {
    name: string,
    state: string,
    isExit: boolean,
    ui: NodeUIInput,
    connections: Array<NodeReferenceInput>
}
interface NodeReferenceInput {
    name: string,
    id: string,
    direction: string,
}
interface UpdateNodeInput {
    id: ID,
    name: string,
    state: string,
    isExit: boolean,
    ui: NodeUIInput,
    connections: Array<NodeReferenceInput>,
    operation: string,
}
interface NodeUI {
    x: Float,
    y: Float,
}
interface NodeUIInput {
    x: Float,
    y: Float,
}
