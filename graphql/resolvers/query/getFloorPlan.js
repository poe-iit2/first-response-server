import FloorPlan from "../floorPlan.js"

// args, context, info

// Define an asynchronous function to fetch a floor based on the provided 'id'
// The function expects an object with an 'id' property
/**
 * @param {{id: import("graphql-ws").ID}} _
 * @param {any} context
 * @returns {Promise<FloorPlan>}
 */
export async function getFloorPlan({ id }, context) {
  if (!context?.isAuth) throw new Error("Error retrieving Floor data. You are not authenticated.")

  const floorPlan = await FloorPlan.build(id, context)

  return floorPlan
}
