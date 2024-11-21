// Destructure Schema from Mongoose to define a schema for a MongoDB collection
const { model, Schema } = require("mongoose")

// Destructure ObjectId type from Mongoose to use it as a reference type in the schema
const { ObjectId } = require("mongoose").Types

const pubsub = require("../utils/pubsub")

// Define a schema for a "Building" collection
const buildingSchema = new Schema({
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
  const Building = require("../graphql/resolvers/building")
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
  const { logSchema } = require("./log")
  const { floorSchema } = require("./floor")
  const LogModel = model("Log", logSchema)
  const FloorModel = model("Floor", floorSchema)

  const logs = await LogModel.find({
    buildings: { $in: [doc.id]}
  })

  for(const log of logs){
    const regex = new RegExp(`\\(([^\\)]*)(${doc.name})([^\\)]*)\\)\\[building\\]\\[${doc.id}\\]`, 'g')

    log.message = log.message.replace(regex, (match, prefix, oldName, suffix) => {
      return `${prefix}${oldName}${suffix}`
    })

    log.buildings = log.buildings.filter(buildingId => buildingId.toString() !== doc.id)

    await log.save()
  }

  for(const floorId of doc.floors){
    await FloorModel.findOneAndDelete({
      _id: floorId
    })
  }
})

// Export the building schema as part of an object
module.exports = {
  buildingSchema
}