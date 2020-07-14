const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');
const cleanCache = require("../middlewares/cleanCache")

module.exports = app => {
   app.get('/api/blogs/:id', requireLogin, async (req, res) => {
      console.log("/api/blogs/:id")
      const blog = await Blog.findOne({
         _user: req.user.id,
         _id: req.params.id
      });

      res.send(blog);
   });

   app.get('/api/blogs', requireLogin, async (req, res) => {

      const blogs = await Blog.find({ _user: req.user.id }).cache( {key: req.user.id} );
      
      res.send(blogs);
   })

   app.post('/api/blogs', requireLogin , cleanCache, async (req, res) => {
      const { title, content, imageUrl } = req.body;
      console.log("post('/api/blogs'")
      const blog = new Blog({
         title,
         content,
         imageUrl,
         _user: req.user.id
      });

      try {
         console.log("post('/api/blogs' before send response")
         await blog.save();
         console.log("post('/api/blogs' send response")
         res.send(blog);
      } catch (err) {
         res.send(400, err);
      }
      console.log("post('/api/blogs' is done")
   });
};
