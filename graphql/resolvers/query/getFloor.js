import Floor from "../floor";

// args, context, info

// Define an asynchronous function to fetch a floor based on the provided 'id'
// The function expects an object with an 'id' property
export async function getFloor({ id }, context) {
  if (!context?.isAuth) throw new Error("Error retrieving Floor data. You are not authenticated.")
  const floor = await Floor.build(id, context)
  return floor
}