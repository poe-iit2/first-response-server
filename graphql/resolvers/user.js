import { model } from "mongoose"
import { userSchema } from "../../models/user.js"

const UserModel = model("User", userSchema)

// Define a 'User' class to encapsulate user-related operations and data
export default class User {
  context;
  user;
  id;
  username;
  email;
  roles;
  accountStatus;
  createdAt;
  updatedAt;

  // Create a way to get user with either userId or userEmail
  // Make the class more... flexible
  static async build(userId, context) {
    if (!context?.isAuth) throw new Error("Error retrieving User data. You are not authenticated.")
    const user = await UserModel.findById(userId)

    if (!user) {
      throw new Error(`User ${userId} not found`)
    }
    return new User(user, context)
  }

  constructor(user, context) {
    if (!context?.isAuth) throw new Error("Error retrieving data. You are not authenticated.")
    this.context = context
    this.user = user

    this.id = user.id
    this.username = user.username
    this.email = user.email
    // Intentionally skipped user.password
    this.roles = user.roles
    this.accountStatus = user.accountStatus

    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }

  async buildings() {
    const Building = require("./building").default

    const buildings = this.user.buildings.map(async buildingId => await Building.build(buildingId, this.context))

    return buildings
  }
}
