const logInputSchema = `
  input LogInput {
    status: [String]
    nodes: [String]
    floors: [String]
    buildings: [String]
    page: Float
    pageCount: Float
    date: Float
  }
`

module.exports = {
  schema: logInputSchema
}