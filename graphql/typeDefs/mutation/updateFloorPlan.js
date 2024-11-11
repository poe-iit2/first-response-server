// Change this to update Floor

const updateFloorPlanSchema = `
  updateFloorPlan(createNodeInputs: [CreateNodeInput]!, updateNodeInputs: [UpdateNodeInput]!, id: ID!): FloorPlan
`

module.exports = {
  schema: updateFloorPlanSchema
}