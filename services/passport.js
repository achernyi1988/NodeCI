const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
 

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback',
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
         console.log("GoogleStrategy profile.id ", profile.id) 
        const existingUser = await User.findOne({ googleId: profile.id });
        console.log("existingUser", existingUser) 
        if (existingUser) {
          return done(null, existingUser); 
        }
        const user = await new User({
          googleId: profile.id,
          displayName: profile.displayName
        }).save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
