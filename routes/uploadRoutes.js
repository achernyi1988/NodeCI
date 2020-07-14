const AWS = require("aws-sdk")
const uuid = require("uuid")
 
const requireLogin = require("../middlewares/requireLogin")
const s3 = new AWS.S3({
   region: 'eu-central-1',
   accessKeyId: process.env.storageAWSKeyId,
   secretAccessKey: process.env.secretAWSKey
})



module.exports = app => {
   app.get("/api/upload", (req, res)=>{
 

      const key = `${req.user.id}/${uuid()}.jpeg`
         s3.getSignedUrl("putObject", {
            "Bucket":"achernyi-blog-bucket",
            "ContentType": "image/jpeg",
            "Key": key
         }, (err, url)=>{
            if(err){
               console.log(err)
            }
            res.send({key, url})
         })
   })

}