import Floor from "../floor.js";

// args, context, info

// Define an asynchronous function to fetch a floor based on the provided 'id'
// The function expects an object with an 'id' property
/**
 * @param {{id: import("graphql-ws").ID}} _
 * @param {any} context
 * @returns {Promise<Floor>}
 */
export async function getFloor({ id }, context) {
  if (!context?.isAuth) throw new Error("Error retrieving Floor data. You are not authenticated.")
  const floor = await Floor.build(id, context)
  return floor
}