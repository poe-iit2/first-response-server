export const createFloorInput = {
  schema: `
  input CreateFloorInput {
    id: ID
    name: String!
    buildingId: ID
    image: FloorImageInput
    isDeleted: Boolean
    nodes: [UpdateNodeInput]
  }
`
};
export const updateFloorInput = {
  schema: `
  input UpdateFloorInput {
    id: ID!
    name: String
    image: FloorImageInput
    buildingId: String
    isDeleted: Boolean
  }
`
};