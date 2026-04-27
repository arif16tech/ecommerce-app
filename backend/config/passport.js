const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder_client_secret',
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
          // If user exists but doesn't have googleId linked, link it
          if (!user.googleId) {
            user.googleId = googleId;
            user.isVerified = true; // Auto-verify if they login with Google
            await user.save();
          }
          return done(null, user);
        }

        // Create new user if doesn't exist
        user = await User.create({
          name,
          email,
          googleId,
          isVerified: true, // Google accounts are implicitly verified
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// We won't strictly use express-session for maintaining login state,
// but passport requires serialization functions.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
