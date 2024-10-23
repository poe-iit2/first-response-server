const logOutputSchema = `
  type LogOutput {
    logs: [Log]
    totalCount: Float
  }
`

module.exports = {
  schema: logOutputSchema
}