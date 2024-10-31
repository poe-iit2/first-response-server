// Change this to update Floor

const updateFloorPlanSchema = `
  updateFloorPlan(createNodeInputs: [CreateNodeInput]!, createInvisibleNodeInputs: [CreateInvisibleNodeInput]!,updateNodeInputs: [UpdateNodeInput]!, updateInvisibleNodeInputs: [UpdateInvisibleNodeInput]!, id: ID!): FloorPlan
`

module.exports = {
  schema: updateFloorPlanSchema
}