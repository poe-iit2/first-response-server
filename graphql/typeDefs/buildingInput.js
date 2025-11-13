

export const createBuildingInput = {
  schema: `
  input CreateBuildingInput {
    name: String!
  }
`
}
export const updateBuildingInput = {
  schema: `
  input UpdateBuildingInput {
    id: ID!
    name: String
    isDeleted: Boolean
  }
`
}