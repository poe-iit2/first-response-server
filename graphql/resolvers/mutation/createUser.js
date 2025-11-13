import { model } from "mongoose"
import { userSchema } from "../../../models/user.js"
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
const { sign } = jwt

const UserModel = model("User", userSchema)

import User from "../user.js"

// Define an asynchronous function to create a user based on the provided 'email' and 'password'
// The function expects an object with an 'email' and 'password' property
/**
 * 
 * @param {{email: String, password: String}} param0 
 * @param {*} context 
 * @returns 
 */
export async function createUser({ email, password }, context) {
  // regex for email validation: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  const existingUser = await UserModel.findOne({ email })

  if (existingUser) {
    throw new Error('Email is currently in use')
  }

  const hashedPassword = await hash(password, 10)

  const newUser = await UserModel.create({ email, password: hashedPassword, roles: ["user"], accountStatus: "created" })

  // active is another state

  const userId = newUser.id
  const roles = ["user"]

  const token = sign({ userId, roles }, process.env.ACCESS_SECRET, { expiresIn: '3d' })

  context.response.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? "None" : undefined,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })

  context.isAuth = true
  context.user = {
    userId,
    roles
  }

  // Send a mail somewhere around here with their credentials

  return new User(newUser, context)
}
