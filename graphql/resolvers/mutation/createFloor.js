const { model } = require("mongoose")
const { floorSchema } = require("../../../models/floor")
const FloorModel = model("Floor", floorSchema )

const Floor = require("../floor")
const {
  createLog,
  formatModel
}= require("../../../utils/createLog")

const createFloor = async ({
  createFloorInput: { name, buildingId, image }
}, context) => {
  if(!context?.isAuth) throw new Error("Error creating Building. You are not authenticated.")

  let floor = await FloorModel.findOne({ name, building: buildingId })
  if(floor) throw new Error("Floor already exists")

  floor = new FloorModel({ name, building: buildingId, image })

  await floor.save()

  floor = new Floor(floor, context)
  const building = await floor.building()
  createLog("FLOOR_CREATED", `${formatModel(floor, "floor", "Floor")} has been created in ${formatModel(building, "building", "Building")}`, {
    buildings: [buildingId],
    floors: [floor.id]
  })

  return floor
}

module.exports = {
  createFloor
}