import { model } from "mongoose"
import { floorSchema } from "../../../models/floor"

const FloorModel = model("Floor", floorSchema)

import Floor from "../floor"

// Define an asynchronous function to fetch all floors
export async function getFloors(_, context) {
  if (!context?.isAuth) throw new Error("Error retrieving Floor data. You are not authenticated.")
  const floors = await FloorModel.find() || []

  const response = []
  for (const floor of floors) {
    response.push(new Floor(floor, context))
  }
  return response
}
