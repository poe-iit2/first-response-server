const { model } = require("mongoose")
const { floorSchema } = require("../../../models/floor")
const FloorModel = model("Floor", floorSchema )

const Floor = require("../floor")
const {
  createLog,
  formatModel,
  updateLog
} = require("../../../utils/createLog")
const Building = require("../building")

const updateFloor = async ({
  updateFloorInput: { id, name, buildingId, image, isDeleted }
}, context) => {
  if(!context?.isAuth) throw new Error("Error updating Floor. You are not authenticated.")

  const currentBuilding = await Building.build(floor.building, context)
  const floor = await FloorModel.findById(id)

  if(!floor) {
    throw new Error(`Floor ${id} not found`)
  }

  if(isDeleted) {
    await floor.deleteOne()
    updateLog("floor", floor.id, floor.name)
    createLog("FLOOR_DELETED", `Floor ${floor.name} on ${formatModel(currentBuilding, "building", "Building")} has been deleted`,
    {
      buildings: [currentBuilding.id]
    })
    // Create logic for when a floor is deleted and when a floor name is updated
    return null
  }
  const logs = [], updateLogs = []
  if(name?.length && name !== floor.name){
    const oldName = floor.name
    floor.name = name
    updateLogs.push(["floor", floor.id, oldName, floor.name])
    logs.push(["FLOOR_NAME_CHANGE", `Floor ${oldName} on ${formatModel(currentBuilding, "building", "Building")} has been renamed to ${formatModel(floor, "floor")}`])
  }
  if(buildingId?.length && buildingId !== floor.building._id.toString()){
    try{
      const newBuilding = await Building.build(buildingId, context)
      logs.push(["FLOOR_RELOCATED", `${formatModel(floor, "floor", "Floor")} has been moved to ${formatModel(newBuilding, "building", "Building")} from ${formatModel(currentBuilding, "building", "Building")} `, {
        buildings: [currentBuilding.id, newBuilding.id],
        floors: [floor.id]
      }])
    }catch{
      console.log("Building id didn't exist so I'll wait for it to fail")
    }
    floor.building = buildingId
  }
  if(image && image !== floor.image){
    // I haven't done image yet..., please work on that
    // Also work on making the ()[][] a callable function for readability
    logs.push(["FLOOR_IMAGE_UPLOADED", `A new image has been uploaded to ${formatModel(floor, "floor", "Floor")} in ${formatModel(currentBuilding, "building", "Building")}`, {
      buildings: [currentBuilding.id],
      floors: [floor.id]
    }])
    floor.image = image
  }

  await floor.save()
  // If it saves successfully then add the logs
  for(const [modelType, id, oldName, newName] of updateLogs){
    updateLog(modelType, id, oldName, newName)
  }
  for(const [type, message, ids] of logs){
    // I'm not adding await since I want this to be non blocking
    createLog(type, message, ids)
  }
  return new Floor(floor, context)
}

module.exports = {
  updateFloor
}