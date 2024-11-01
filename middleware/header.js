const addHeaders = require("../utils/addHeaders")

const headerMiddleWare = (req, res, next) => {
  addHeaders(req, res)
  console.log(req.headers)
  next()
}

module.exports = headerMiddleWare