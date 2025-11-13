// Destructure Schema from Mongoose to define a schema for a MongoDB collection
import { model, Schema } from "mongoose"

// Destructure ObjectId type from Mongoose to use it as a reference type in the schema
import { Types } from "mongoose"
const { ObjectId } = Types

import pubsub from "../utils/pubsub"

import Building from "../graphql/resolvers/building"
import { logSchema } from "./log"
import { floorSchema } from "./floor"

// Define a schema for a "Building" collection
export const buildingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  floors: [{
    type: ObjectId,
    ref: "Floor",
  }]
}, {
  // Add createdAt and updatedAt timestamps to the schema automatically
  timestamps: true,
  versionKey: false
})

buildingSchema.post("save", async (doc) => {
  const BuildingModel = model("Building", buildingSchema)
  pubsub.publish("BUILDING_UPDATE", {
    buildingUpdate: Building.build(doc._id.toString(), {
      isAuth: true
    })
  })

  const buildings = await BuildingModel.find()
  console.log("Publishing BUILDING_UPDATES")
  pubsub.publish("BUILDING_UPDATES", {
    buildingUpdates: buildings.map(
      building => Building.build(building._id.toString(), {
        isAuth: true
      })
    )
  })
})

buildingSchema.post("findOneAndDelete", async (doc) => {
  const LogModel = model("Log", logSchema)
  const FloorModel = model("Floor", floorSchema)

  const logs = await LogModel.find({
    buildings: { $in: [doc.id] }
  })

  for (const log of logs) {
    const regex = new RegExp(`\\(([^\\)]*)(${doc.name})([^\\)]*)\\)\\[building\\]\\[${doc.id}\\]`, 'g')

    log.message = log.message.replace(regex, (match, prefix, oldName, suffix) => {
      return `${prefix}${oldName}${suffix}`
    })

    log.buildings = log.buildings.filter(buildingId => buildingId.toString() !== doc.id)

    await log.save()
  }

  for (const floorId of doc.floors) {
    await FloorModel.findOneAndDelete({
      _id: floorId
    })
  }
})
