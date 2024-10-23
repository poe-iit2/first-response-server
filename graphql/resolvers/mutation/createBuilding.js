const { model } = require("mongoose")
const { buildingSchema } = require("../../../models/building")
const BuildingModel = model("Building", buildingSchema )

const Building = require("../building")
const {
  createLog,
  formatModel
} = require("../../../utils/createLog")

const createBuilding = async ({ createBuildingInput: { name }}, context) => {
  if(!context?.isAuth) throw new Error("Error creating Building. You are not authenticated.")

  let building = await BuildingModel.findOne({ name })
  if(building) throw new Error("Building already exists")

  // Add error handlng 
  building = new BuildingModel({ name })
  await building.save()

  createLog("BUILDING_CREATED", `${formatModel(building, "building", "Building")} has been created`, {
    buildings: [building.id]
  })

  return new Building(building, context)
}

module.exports = {
  createBuilding
}