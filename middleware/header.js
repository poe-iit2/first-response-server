const addHeaders = require("../utils/addHeaders")

const headerMiddleWare = (req, res, next) => {
  addHeaders(req, res)
  next()
}

module.exports = headerMiddleWare