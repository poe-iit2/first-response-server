const loginSchema = `
  type Login {
    token: String
    user: User
    expiresIn: String
  }
`

module.exports = {
  schema: loginSchema
}