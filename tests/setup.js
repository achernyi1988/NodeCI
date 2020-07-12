const mongoose = require("mongoose")
require("../models/User")

jest.setTimeout(90000);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongoURI, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});
