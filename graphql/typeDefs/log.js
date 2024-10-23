const logSchema = `
  type Log {
    id: String!
    type: String!
    message: String!
    buildings: [Building]
    floors: [Floor]!
    nodes: [Node]!
    priority: Float
    updatedAt: String!
    createdAt: String!
  }
`

module.exports = {
  schema: logSchema
}