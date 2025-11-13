import addHeaders from "../utils/addHeaders.js"

export default function headerMiddleWare(req, res, next) {
  addHeaders(req, res)
  next()
}
