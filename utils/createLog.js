const { model } = require("mongoose")

const { logSchema } = require("../models/log")
const LogModel = model("Log", logSchema)

const createLog = (type, message, ids = {}) => {
  const log = new LogModel({
    type,
    message,
    ...ids,
    priority: (type in priorities) ? priorities[type] : 3
  })

  // This is to make sure it's not blocking a thread
  log.save()
}

const formatModel = (initModel, modelType, prefix, suffix) => {
  return `(${prefix || ""}${prefix?.length ? " " : ""}${initModel.name}${suffix?.length ? " " : ""}${suffix|| ""})[${modelType}][${initModel.id}]`
}

const updateLog = async (modelType, id, oldName, newName) => {
  const query = {}
  switch(modelType){
    case "building":
      query["buildings"] = { $in: [id] }
      break
    case "floor":
      query["floors"] = { $in: [id] }
      break
    case "node":
      query["nodes"] = { $in: [id] }
      break
    default:
      return
  }

  const logs = await LogModel.find(query)

  const regex = new RegExp(`\\(([^\\)]*)(${oldName})([^\\)]*)\\)\\[${modelType}\\]\\[${id}\\]`, 'g');
  for(const log of logs) {
    log.message = log.message.replace(regex, (match, prefix, oldName, suffix) => {
      if(newName?.length){
        return `(${prefix}${newName}${suffix})[${modelType}][${id}]`
      }
      return `${prefix}${oldName}${suffix}`
    })

    if(!newName?.length){
      switch(modelType){
        case "node":
          log.nodes = log.nodes.filter(nodeId => nodeId.toString() !== id)
          break
        case "floor":
          log.floors = log.floors.filter(floorId => floorId.toString() !== id)
          break
        case "building":
          log.buildings = log.buildings.filter(buildingId => buildingId.toString() !== id)
          break
        default:
          break
      }
    }

    log.save()
  }

  // text.replace(regex, (match, prefix, oldName, suffix) => `(${prefix}Tomiwa${suffix})[node][Hey hey hey]`)
}

// updateOCcurence -> This one changes []()() to just the guy in []

const priorities = {
  NODE_DELETED: 5,
  NODE_CREATED: 3,
  NODE_NAME_CHANGE: 2,
  NODE_SAFE: 1,
  NODE_STUCK: 5,
  NODE_COMPROMISED: 5,
  NODE_STATE_CHANGE: 3,
  NODE_EXIT: 2,
  NODE_LOCATION_CHANGED: 2,
  FLOOR_CREATED: 3,
  FLOOR_DELETED: 4,
  FLOOR_NAME_CHANGE: 2,
  FLOOR_RELOCATED: 3,
  FLOOR_IMAGE_UPLOADED: 2,
  BUILDING_CREATED: 3,
  BUILDING_DELETED: 4,
  BUILDING_NAME_CHANGE: 2
}

module.exports = {
  createLog,
  formatModel,
  updateLog
}