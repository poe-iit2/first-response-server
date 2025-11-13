// Make a more sophisicated model where tokens are stored in the database and can be refreshed/invalidated
import Status from "../status.js"

// Define an asynchronous function to authenticate a user based on the provided 'email' and 'password'
// The function expects an object with an 'email' and 'password' property
export async function logoutUser(_, context) {
  context.isAuth = false
  context.user = null
  context.response.cookie('token', "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? "None" : undefined,
    expires: new Date(0)
  })

  return new Status({
    message: "Logged out successfully",
    status: 200
  })
}
