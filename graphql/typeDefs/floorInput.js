const createFloorInputSchema = `
  input CreateFloorInput {
    id: ID
    name: String!
    buildingId: ID
    image: FloorImageInput
    isDeleted: Boolean
    nodes: [UpdateNodeInput]
  }
`

const updateFloorInputSchema = `
  input UpdateFloorInput {
    id: ID!
    name: String
    image: FloorImageInput
    buildingId: String
    isDeleted: Boolean
  }
`

module.exports = {
  createFloorInput: {
    schema: createFloorInputSchema
  },
  updateFloorInput: {
    schema: updateFloorInputSchema
  }
}