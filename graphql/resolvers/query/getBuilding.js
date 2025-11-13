import Building from "../building.js"

// Define an asynchronous function to fetch a building based on the provided 'id'
// The function expects an object with an 'id' property
/**
 * 
 * @param {{id: import("graphql-ws").ID}} param0 
 * @param {*} context 
 * @returns {Promise<Building>}
 */
export async function getBuilding({ id }, context) {
  if (!context?.isAuth) throw new Error("Error retrieving Building data. You are not authenticated.")
  const building = await Building.build(id, context)
  return building
}
