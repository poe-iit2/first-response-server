import authParse from "../utils/authParse"

// Middleware function to authenticate tokens in incoming requests
export default function authenticateToken(req, _, next) {
  authParse(req)
  return next() // Call the next middleware or route handler
}
