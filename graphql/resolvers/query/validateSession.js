import User from "../user.js"

export async function validateSession({ }, context) {
  if (!context?.isAuth) throw new Error("Error validating session. You are not authenticated.")

  const user = await User.build(context.user.userId, context)
  return user
}
