const floorPlanSchema = `
  type FloorPlan {
    id: ID!
    name: String!
    building: Building!
    nodes: [Node]!
    image: FloorImage
    createdAt: String!
    updatedAt: String!
  }
`

module.exports = {
  schema: floorPlanSchema
}