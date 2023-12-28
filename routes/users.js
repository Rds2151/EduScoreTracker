var express = require("express");
var router = express.Router();
const flash = require("connect-flash");
const { register } = require("../controllers/userController");
const passport = require("passport");

router.use(flash())

router.use((req,res,next) => {
	const user = req.user;
	if (typeof user === "undefined") {
        if (req.originalUrl === '/users/login' || req.originalUrl === '/users/register' || req.originalUrl === '/users/password') {
            return next();
        } else {
            return res.redirect('/users/login');
        }
    }
	next();
})

router.get("/register", function (req, res, next) {
    res.render("register");
});

router.get("/login", (req, res, next) => {
	let data = req.flash()
	if (data.error) result = [data.error,true]
	else result = data.messages 

    res.render("login", {"messages" : result});
});


router.get("/dashboard", (req, res, next) => {
	const user = req.user;
    res.render("index", { "user": user });
});

router.post("/register", async (req, res, next) => {
	if (req.body.password !== req.body.cpassword) res.render("register", { message: "Password does not match" });

    const result = await register(req.body);
    if (result.hasError) {
        res.render("register", { message: result.error });
    } else {
        req.flash("messages", [result.message, false]);
        res.redirect("/users/login");
    }
});

router.post('/login', 
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
  }),(req,res,next) => {
	req.session.user = req.user;
	res.redirect("/users/dashboard");
  }
);

router.get("/logout", (req,res,next) => {
	req.logOut((err) => {
		if(err) {
			return next(err);
		}
		res.redirect("/users/login")
	})
})

router.post("/createSession", (req, res, next) => {
    console.log(req.body)
    res.redirect("dashboard")
})

router.use((req,res,next) => {
	res.redirect("/404")
})


module.exports = router;
