const { clearCache } = require("../services/cache")

module.exports = async (req, res, next) => {
   console.log("before next")
   await next()
   console.log("after next")
   clearCache(req.user.id)
}