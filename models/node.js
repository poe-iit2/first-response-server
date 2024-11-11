// Destructure Schema from Mongoose to define a schema for a MongoDB collection
const { model, Schema } = require("mongoose")
const { ObjectId } = require("mongoose").Types

// Define a schema for a "Node" collection
const nodeSchema = new Schema({
  name: String,
  state: {
    type: String,
    required: true
  },
  isExit: {
    type: Boolean,
    required: true
  },
  floor: {
    type: ObjectId,
    ref: "Floor",
    required: true
  },
  direction: String,
  connections: [{
    id: {
      type: ObjectId,
      ref: "Node",
      required: true
    },
    direction: {
      type: String,
      required: true
    }
  }], // Array of connections
  ui: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  }
}, {
  // Add createdAt and updatedAt timestamps to the schema automatically
  timestamps: true,
  versionKey: false
})

// Add a post-save hook to the schema
nodeSchema.post("findOneAndDelete", async (doc) => {
  const { logSchema } = require("./log")
  const { floorSchema } = require("./floor")
  const { invisibleNodeSchema } = require("./invisibleNode")
  const LogModel = model("Log", logSchema)
  const FloorModel = model("Floor", floorSchema )
  const InvisibleNodeModel = model("InvisibleNode", invisibleNodeSchema )

  const logs = await LogModel.find({
    nodes: { $in: [doc.id]}
  })

  for(const log of logs){
    const regex = new RegExp(`\\(([^\\)]*)(${doc.name})([^\\)]*)\\)\\[node\\]\\[${doc.id}\\]`, 'g')

    log.message = log.message.replace(regex, (match, prefix, oldName, suffix) => {
      return `${prefix}${oldName}${suffix}`
    })

    log.nodes = log.nodes.filter(nodeId => nodeId.toString() !== doc.id)

    await log.save()
  }

  const floorId = doc.floor.toString()
  const floor = await FloorModel.findById(floorId)

  if(floor){
    floor.nodes = floor.nodes.filter(node => node._id.toString() !== doc._id.toString())
    await floor.save()
  }


  const invisibleNodes = await InvisibleNodeModel.find({ connectedNodes: { $in: doc._id } })
  for(const invisibleNode of invisibleNodes) {
    await InvisibleNodeModel.findOneAndDelete({
      _id: new ObjectId(invisibleNode._id)
    })
  }
})



// For sanity, I'm doing this so i don't have to worry about it anywhere else
nodeSchema.post("save", async (doc) => {
  const { floorSchema } = require("./floor")
  const FloorModel = model("Floor", floorSchema )

  const floorId = doc.floor

  const floor = await FloorModel.findById(floorId)

  // This could happen because the floor got deleted, triggering the floor
  // middleware, which triggers the node delete middleware which triggers the
  // invisibleNode middleware, which triggers the node save system
  if(!floor) return
  
  floor.nodes = floor.nodes.filter(node => node._id.toString() !== doc._id.toString())
  // console.log(doc._id, doc.id)
  floor.nodes.push(doc._id)
  await floor.save()

})

// Export the node schema as part of an object
module.exports = {
  nodeSchema
}