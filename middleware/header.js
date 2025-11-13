import addHeaders from "../utils/addHeaders"

export default function headerMiddleWare(req, res, next) {
  addHeaders(req, res)
  next()
}
