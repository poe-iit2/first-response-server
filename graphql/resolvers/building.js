const { model } = require("mongoose")
const { buildingSchema } = require("../../models/building")
const BuildingModel = model("Building", buildingSchema )

// Define a 'Building' class to encapsulate building-related operations and data

// Create a class that is inherited by all this classes so you don't have to worry about keeping the auth check everytime
class Building {
  static async build(buildingId, context) {
    if(!context?.isAuth) throw new Error("Error retrieving Building data. You are not authenticated.")
    const building = await BuildingModel.findById(buildingId).exec()

    if (!building) {
      throw new Error("Building not found")
    }
    return new Building(building, context)
  }

  constructor(building, context) {
    if(!context?.isAuth) throw new Error("Error retrieving data. You are not authenticated.")
    this.context = context
    this.building = building

    this.id = building.id
    this.name = building.name
    this.createdAt = building.createdAt
    this.updatedAt = building.updatedAt
  }


  async floors() {
    const Floor = require("./floor")
    const floors = this.building.floors || []

    const response = []
    for(const floor of floors) {
      response.push(await Floor.build(floor._id, this.context))
    }
    return response
  }
}

// Export the Building class for use in other parts of the application
module.exports = Building