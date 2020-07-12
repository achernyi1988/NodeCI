const mongoose = require("mongoose")
const redis = require("redis")
const util = require("util")
 

const client = redis.createClient(process.env.redisUrl)
client.hget = util.promisify(client.hget)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = {}) {
   this.useCache = true
   this.hashKey = JSON.stringify(options.key || "undefined")

   return this // allows to manipulate Query after call.
   //Blog.find({ _user: req.user.id }).cache().//.limit(10).count()
}

mongoose.Query.prototype.exec = async function () {
   // console.log("I'm about to run a query")

   if (!this.useCache) {
      console.log("Not use cache")
      return exec.apply(this, arguments)
   }


   // console.log(this.getQuery(), this.model.collection.collectionName)

   const key = JSON.stringify(Object.assign({}, this.getQuery(), {
      collection: this.model.collection.modelName
   }))

   const cacheValue = await client.hget(this.hashKey, key)

   if (cacheValue) {
      console.log("From Cache")
      const doc = JSON.parse(cacheValue)

      return Array.isArray(doc)
         ? doc.map(d => new this.model(d))
         : new this.model(doc)

      // new this.model()

   }

   const result = await exec.apply(this, arguments)
 
   client.hset(this.hashKey, key, JSON.stringify(result))

   console.log("From MongoDB hashKey = ", this.hashKey)

   return result

}

module.exports = {
   clearCache(key){
      console.log("clearCache", JSON.stringify(key))
      client.del(JSON.stringify(key))
   }
}