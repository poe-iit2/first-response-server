const { gql } = require("apollo-server-express")

module.exports = gql`
  extend type Subscription {
    deviceUpdate(nodeId: ID): DeviceUpdate
  }

  type DeviceUpdate {
    nodeId: ID!
    motionDetected: Boolean
    temperature: Float
    radioSignalStrength: Float
  }
`
