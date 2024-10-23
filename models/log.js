// Destructure Schema from Mongoose to define a schema for a MongoDB collection
const { Schema, Types: { ObjectId} } = require("mongoose")

// Define a schema for a "Log" collection
const logSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  buildings: [{
    type: ObjectId,
    ref: "Building"
  }],
  floors: [{
    type: ObjectId,
    ref: "Floor"
  }],
  nodes: [{
    type: ObjectId,
    ref: "Node"
  }],
  priority: Number
}, {
  // Add createdAt and updatedAt timestamps to the schema automatically
  timestamps: true
})

// Export the log schema as part of an object
module.exports = {
  logSchema
}