const { model, Types: { ObjectId}} = require("mongoose")
const { logSchema } = require("../../../models/log")

const LogModel = model("Log", logSchema)

const Log = require("../log")

// In the future filter based on which building they have permission in
const getLogs = async ({ logInput }, context) => {
  // Add sort by date
  if(!context?.isAuth) throw new Error("Error retrieving Log data. You are not authenticated.")

  let { nodes, floors, buildings, status, page, pageCount, date } = logInput

  const filters = []
  if(nodes?.length){
    nodes = nodes.map(id => new ObjectId(id))
    filters.push(
      { nodes: { $in: nodes } }
    )
  }
  if(floors.length){
    floors = floors.map(id => new ObjectId(id))
    filters.push(
      { floors: { $in: floors } }
    )
  }
  if(buildings?.length){
    buildings = buildings.map(id => new ObjectId(id))
    filters.push(
      { buildings: { $in: buildings } }
    )
  }
  if(status?.length){
    filters.push(
      { type: { $in: status } }
    )
  }

  if(isNaN(page))page = 1
  if(isNaN(pageCount))pageCount = 20
  if(date !== 1)date = -1

  console.log(nodes, floors, buildings, status, date)

  const skip = (page - 1) * pageCount

  const filter = {}

  if(filters.length){
    filter["$or"] = filters
  }
  console.log(filter)

  const pipeline = [
    { $match: filter },
    {
      $facet: {
        total: [
          { $count: 'count' }
        ],
        data: [
          { $sort: { createdAt: date } },
          { $skip: skip },
          { $limit: pageCount }
        ]
      }
    }
  ]

  const result = await LogModel.aggregate(pipeline)
  const totalCount = result[0]?.total[0]?.count || 0
  const logs = result[0]?.data || []

  const response = []
  for (const log of logs) {
    response.push(new Log(log, context))
  }
  return {
    logs: response,
    totalCount
  }
}

module.exports = { getLogs }