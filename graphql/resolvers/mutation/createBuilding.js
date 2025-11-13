import { model } from "mongoose"
import { buildingSchema } from "../../../models/building"
const BuildingModel = model("Building", buildingSchema)

import Building from "../building"
import { createLog, formatModel } from "../../../utils/createLog"

export async function createBuilding({ createBuildingInput: { name } }, context) {
  if (!context?.isAuth) throw new Error("Error creating Building. You are not authenticated.")

  let building = await BuildingModel.findOne({ name })
  if (building) throw new Error("Building already exists")

  // Add error handlng 
  building = new BuildingModel({ name })
  await building.save()

  createLog("BUILDING_CREATED", `${formatModel(building, "building", "Building")} has been created`, {
    buildings: [building.id]
  })

  return new Building(building, context)
}
