import { model } from "mongoose"
import { buildingSchema } from "../../../models/building"

const BuildingModel = model("Building", buildingSchema)

import Building from "../building"

// Define an asynchronous function to fetch all buildings
export async function getBuildings(_, context) {
  if (!context?.isAuth) throw new Error("Error retrieving Building data. You are not authenticated.")
  const buildings = await BuildingModel.find() || []

  const response = []
  for (const building of buildings) {
    response.push(new Building(building, context))
  }
  return response
}
