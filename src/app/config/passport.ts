import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails![0].value;
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails![0].value,
            picture: profile.photos![0].value,
            auths: [{ provider: "google", providerId: profile.id }],
            isVerified: true,
          });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);
