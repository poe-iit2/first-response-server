import { getAllowedOrigins } from "../configs/allowedOrigins.js"

const addHeaders = (req, res) => {
  const allowedOrigins = getAllowedOrigins()
  if (allowedOrigins.includes(req.headers.origin)) {
    // Set the access-control-allow-origin header to every origin in allowedOrigins later (instead of just one)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', 'true')
  } else {
    res.header('Access-Control-Allow-Origin', '*')
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, credentials')
}

export default addHeaders