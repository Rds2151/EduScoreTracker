const LocalStrategy = require("passport-local").Strategy;
const Server = require("../services/Server");
const bcrypt = require("bcrypt");
const passport = require("passport");
const sobj = new Server();

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {          
            try {
                const user = await sobj.getUser(email);
                if (user == null) {
                    return done(null, false,"No user found with that email");
                }

                if (bcrypt.compareSync(password, user.Password)) {
                    return done(null, user);
                } else {
                    return done(null, false,"Incorrect password");
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await sobj.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});