const buildingUpdateSchema = `
  buildingUpdate(id: ID!): Building
`

module.exports = {
  schema: buildingUpdateSchema
}