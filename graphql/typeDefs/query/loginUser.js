// Maybe add username in the future for more options
const loginUserSchema = `
  loginUser(email: String!, password: String!): Login
`

module.exports = {
  schema: loginUserSchema
}