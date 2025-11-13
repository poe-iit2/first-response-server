// Import the jsonwebtoken library to handle JWT verification
import { verify } from 'jsonwebtoken'

// Middleware function to authenticate tokens in incoming requests
export default function authParse(req) {
  // Parse cookies from the request headers and create an object to store them
  const cookieSplit = String(req.headers.cookie).split('; ')
  const cookieObj = {}

  // Loop through each cookie and split it into key-value pairs
  for (const str of cookieSplit) {
    const [key, value] = str.split('=')
    cookieObj[key] = value
  }

  // Extract the 'token' from the cookies
  let token = cookieObj['token']

  // If the token is missing or empty, try to get it from the Authorization header
  if (token == null || token === '' || token === undefined) {
    // Check the Authorization header (supporting different capitalizations)
    const authHeader = req?.headers['authorization'] || req?.headers['Authorization']

    // If the Authorization header is present, extract the token part
    if (authHeader) {
      token = authHeader.split(' ')[1]
    }
  }

  // If no token is found, mark the request as unauthenticated and move to the next middleware
  if (token === null || token === '' || token === undefined) {
    req.isAuth = false
    return
  }

  // Verify the token using the secret stored in environment variables
  verify(token, process.env.ACCESS_SECRET, (err, user) => {
    // If the token is invalid, set isAuth to false and proceed to the next middleware
    if (err) {
      req.isAuth = false
      return
    }

    // If the token is valid, mark the request as authenticated and attach the decoded user info
    req.isAuth = true
    req.user = user
  })
}
