const floorImageInputSchema = `
  input FloorImageInput {
    name: String
    url: String
    position: [Float]
    scale: [Float]
  }
`

module.exports = {
  schema: floorImageInputSchema
}