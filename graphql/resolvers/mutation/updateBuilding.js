import { model } from "mongoose"
import { buildingSchema } from "../../../models/building.js"
const BuildingModel = model("Building", buildingSchema)

import Building from "../building.js"
import { createLog, formatModel, updateLog } from "../../../utils/createLog.js"

export async function updateBuilding({
  updateBuildingInput: { id, name, isDeleted }
}, context) {
  if (!context?.isAuth) throw new Error("Error updating Building. You are not authenticated.")

  const building = await BuildingModel.findById(id)

  if (!building) {
    throw new Error("Building not found")
  }

  if (isDeleted) {
    await building.deleteOne()
    updateLog("building", building.id, building.name)
    createLog("BUILDING_DELETED", `Building ${building.name} has been deleted`)
    // Maybe remove all entries of building in logs? or just keep the name?? Yeahhh
    return null
  }

  const logs = []
  const updateLogs = []
  if (name?.length && name !== building.name) {
    const oldName = building.name
    building.name = name
    updateLogs.push(["building", building.id, oldName, building.name])
    logs.push(["BUILDING_NAME_CHANGE", `Building ${oldName} has been renamed to ${formatModel(building, "building")}`, {
      buildings: [id]
    }])
  }

  await building.save()
  for (const [modelType, id, oldName, newName] of updateLogs) {
    updateLog(modelType, id, oldName, newName)
  }
  for (const [type, message, ids] of logs) {
    createLog(type, message, ids)
  }
  return new Building(building, context)
}
