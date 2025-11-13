// Destructure Schema from Mongoose to define a schema for a MongoDB collection
import { model, Schema } from "mongoose"

import deleteImage from "../utils/deleteImage.js"

// Destructure ObjectId type from Mongoose to use it as a reference type in the schema
import { Types } from "mongoose"
const { ObjectId } = Types

import pubsub from "../utils/pubsub.js"

import Floor from "../graphql/resolvers/floor.js"
import { logSchema } from "./log.js"
import { nodeSchema } from "./node.js"
import { buildingSchema } from "./building.js"

// Define a schema for a "Floor" collection
export const floorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  building: {
    type: ObjectId,
    ref: "Building",
    required: true
  },
  nodes: [{
    type: ObjectId,
    ref: "Node",
  }],
  paths: {
    type: Map,
    of: Schema.Types.Mixed
  },
  image: {
    name: {
      type: String,
    },
    url: {
      type: String,
    },
    position: {
      type: [Number],
      default: [0, 0],
    },
    scale: {
      type: [Number],
      default: [1, 1],
    }
  }
}, {
  // Add createdAt and updatedAt timestamps to the schema automatically
  timestamps: true,
  versionKey: false
})

floorSchema.post("save", async (doc) => {
  // Import the Floor resolver to handle fetching floor data
  pubsub.publish("FLOOR_UPDATE", {
    floorUpdate: Floor.build(doc.id, {
      isAuth: true
    })
  })
  const BuildingModel = model("Building", buildingSchema)

  const buildingId = doc.building

  const building = await BuildingModel.findById(buildingId.toString())
  if (!building) throw new Error("Building not found")

  building.floors = building.floors || []
  // Work on getting the position of the id and then adding it back at the same
  // position
  if (!building.floors.find(floor => floor._id.toString() === doc._id.toString())) {
    building.floors.push(doc._id)
  }

  await building.save()
})

floorSchema.post("findOneAndDelete", async (doc) => {
  const LogModel = model("Log", logSchema)
  const NodeModel = model("Node", nodeSchema)
  const BuildingModel = model("Building", buildingSchema)

  const publicId = doc?.image?.url?.split('/').pop().split('.')[0]
  if (publicId?.length) deleteImage(publicId)

  const logs = await LogModel.find({
    floors: { $in: [doc.id] }
  })

  for (const log of logs) {
    const regex = new RegExp(`\\(([^\\)]*)(${doc.name})([^\\)]*)\\)\\[floor\\]\\[${doc.id}\\]`, 'g')

    log.message = log.message.replace(regex, (match, prefix, oldName, suffix) => {
      return `${prefix}${oldName}${suffix}`
    })

    log.floors = log.floors.filter(floorId => floorId.toString() !== doc.id)

    await log.save()
  }

  const nodes = doc.nodes

  for (const node of nodes) {
    await NodeModel.findOneAndDelete({
      _id: node._id
    })
  }

  const building = await BuildingModel.findById(doc.building)

  if (building) {
    building.floors = building.floors.filter(floorId => floorId._id.toString() !== doc._id.toString())

    await building.save()
  }
})
