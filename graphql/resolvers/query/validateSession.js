import User from "../user.js"

/**
 * 
 * @param {*} param0 
 * @param {*} context 
 * @returns {Promise<User>}
 */
export async function validateSession({ }, context) {
  if (!context?.isAuth) throw new Error("Error validating session. You are not authenticated.")

  const user = await User.build(context.user.userId, context)
  return user
}
