// By default, invisible node has no reason to be returned, but for editing it's useful
const { model } = require("mongoose")
const { floorSchema } = require("../../models/floor")
const FloorModel = model("Floor", floorSchema )

const Floor = require("./floor")

class FloorPlan extends Floor {
  static async build(floorId, context) {
    if(!context?.isAuth) throw new Error("Error retrieving data. You are not authenticated.")
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

module.exports = FloorPlan