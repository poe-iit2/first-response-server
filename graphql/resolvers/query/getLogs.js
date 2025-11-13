import mongoose from "mongoose"
const { model, Types: { ObjectId } } = mongoose
import { logSchema } from "../../../models/log.js"

const LogModel = model("Log", logSchema)

import Log from "../log.js"

// In the future filter based on which building they have permission in
/**
 * 
 * @param {{logInput: import("../schema.d.ts").LogInput}} param0 
 * @param {*} context 
 * @returns {Promise<import("../schema.d.ts").LogOutput>}
 */
export async function getLogs({ logInput }, context) {
  // Add sort by date
  if (!context?.isAuth) throw new Error("Error retrieving Log data. You are not authenticated.")

  let { nodes: nodes_, floors: floors_, buildings: buildings_, status, page, pageCount, date } = logInput

  /**
   * @type {Array<import("mongoose").FilterQuery<Log>>}
   */
  const filters = []
  const nodes = nodes_.map(id => new ObjectId(id))
  if (nodes?.length) {
    filters.push(
      { nodes: { $in: nodes } }
    )
  }
  const floors = floors_.map(id => new ObjectId(id))
  if (floors.length) {
    filters.push(
      { floors: { $in: floors } }
    )
  }
  const buildings = buildings_.map(id => new ObjectId(id))
  if (buildings?.length) {
    filters.push(
      { buildings: { $in: buildings } }
    )
  }
  if (status?.length) {
    filters.push(
      { type: { $in: status } }
    )
  }

  if (isNaN(page)) page = 1
  if (isNaN(pageCount)) pageCount = 20
  date = date === 1 ? 1 : -1

  const skip = (page - 1) * pageCount

  const filter = {}

  if (filters.length) {
    filter["$or"] = filters
  }

  /**
   * @type {Array<import("mongoose").PipelineStage>}
   */
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
