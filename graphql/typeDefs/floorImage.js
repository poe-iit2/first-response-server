const floorImageSchema = `
  type FloorImage {
    name: String
    url: String
    position: [Float]
    scale: [Float]
  }
`

module.exports = {
  schema: floorImageSchema
}