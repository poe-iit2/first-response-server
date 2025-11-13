// By default, invisible node has no reason to be returned, but for editing it's useful
import { model } from "mongoose"
import { floorSchema } from "../../models/floor.js"
const FloorModel = model("Floor", floorSchema)

import Floor from "./floor.js"

export default class FloorPlan extends Floor {
  static async build(floorId, context) {
    if (!context?.isAuth) throw new Error("Error retrieving data. You are not authenticated.")
    const floor = await FloorModel.findById(floorId).exec()

    if (!floor) {
      throw new Error(`Floor ${floorId} not found`)
    }
    return new FloorPlan(floor, context)
  }

  constructor(floor, context) {
    super(floor, context)
  }
}
