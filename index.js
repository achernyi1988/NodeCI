const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

require('./models/User');
require('./models/Blog');
require('./services/passport');
require("./services/cache")

mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongoURI, {    useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify:false,
   useCreateIndex: true } );

// const User = mongoose.model('User');

// const f = async () =>{
//    const id = new mongoose.Types.ObjectId("111111111111111111111111")
//    console.log("id",id) 
//    const user = await User.findById(id)
//    console.log("user",user)
// }

// f()

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

if (['production', "ci"].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  }); 
}  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
