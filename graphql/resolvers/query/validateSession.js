import { build } from "../user"

export async function validateSession({ }, context) {
  if (!context?.isAuth) throw new Error("Error validating session. You are not authenticated.")

  const user = await build(context.user.userId, context)
  return user
}
