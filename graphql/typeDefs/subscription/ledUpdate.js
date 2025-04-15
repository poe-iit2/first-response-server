const { gql } = require("apollo-server-express")

module.exports = gql`
  extend type Subscription {
    ledUpdate(nodeId: ID): LEDUpdate
  }

  type LEDUpdate {
    nodeId: ID!
    ledState: Boolean!
  }
`
