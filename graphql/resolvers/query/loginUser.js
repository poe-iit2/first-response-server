const { model } = require("mongoose")
const { userSchema } = require("../../../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserModel = model("User", userSchema)

const User = require("../user")

// Define an asynchronous function to authenticate a user based on the provided 'email' and 'password'
// The function expects an object with an 'email' and 'password' property
const loginUser = async ({ email, password }, context) => {
  let user = await UserModel.findOne({ email })

  if (!user) {
    throw new Error(`'No user with email: ${email} found`)
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw new Error("Invalid password")
  }

  const userId = user.id
  const roles = user.roles

  const token = jwt.sign({ userId, roles }, process.env.ACCESS_SECRET, { expiresIn: '3d' })
  const expiresIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  context.response.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? "None" : undefined,
    expires: expiresIn
  })
  
  context.isAuth = true
  context.user = {
    userId,
    roles
  }

  // user, token, expiration
  user = new User(user, context)
  return {
    token,
    expiresIn,
    user
  }
}

// Export the 'loginUser' function to make it accessible from other modules
module.exports = { loginUser }