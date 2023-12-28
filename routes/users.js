var express = require("express");
var router = express.Router();
const flash = require("connect-flash");
const { register, createSession, fetchAllSession, addTest, fetchTest, updateScore, fetchTestResult } = require("../controllers/userController");
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

router.get("/dashboard", async (req, res, next) => {
    const user = req.user;

    if (!user || Object.keys(user).length === 0) {
        return res.redirect("/");
    }

    try {
        if (user.userType == "teacher") {
            const sessionDetail = await fetchAllSession(user._id);
            
            const tests = await fetchTestResult(sessionDetail.session);

            if (!sessionDetail.hasError) {
                let data = req.flash();
                if (data.messages) {
                    return res.render("index", { "user": user, "session": sessionDetail.session, "testsData": tests.topTwoScores, "messages": data.messages });
                }
            } else {
                throw sessionDetail;
            }
            console.log(tests.topTwoScores)
            res.render("index", { "user": user, "session": sessionDetail.session , "testsData": tests.topTwoScores });
        } else {
            let fetchData = await fetchTest(user._id);
            
            if (!fetchData.hasError) {
                let data = req.flash();
                if (data.messages) {
                    return res.render("index", { "user": user, "tests": fetchData.testData, "messages": data.messages });
                }
            } else {
                throw fetchData;
            }
            res.render("index", { "user" : user , "tests": fetchData.testData })
        }
    } catch (error) {
        res.render("index", { "user": user, "messages": [error.message, true] });
    }
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

router.post("/createSession", async (req, res, next) => {
    const user = req.user;
    const emails = Array.isArray(req.body.email) ? req.body.email : [req.body.email];
    const sessionName = req.body.sessionName;

    const sessionCreationResult = await createSession(emails, sessionName, user._id);

    if (sessionCreationResult.hasError) {
        req.flash("messages", [sessionCreationResult.error, true]);
        res.redirect("/users/dashboard");
    } else {
        req.flash("messages", [sessionCreationResult.message, false]);
        res.redirect("/users/dashboard");
    }
});

router.post("/addTest", async (req, res, next) => {
    const sessionId = req.body.sessionId
    const subjectName = req.body.subjectName
    const questions = req.body.questions

    try {
		const data = await addTest(questions, sessionId, subjectName );
		req.flash("messages",data.message)
		res.send({redirectUrl:"/users/dashboard"})
	} catch (error) {
		req.flash("messages",error.message)
		res.send({redirectUrl:"/users/dashboard"})
	}
})

router.post("/submitTest", async (req, res, next) => {
    const testId = req.body.testId
    const question = req.body;
    const studentId = req.user._id;

    try {
        const testResult = await updateScore(testId,studentId,question) 
        req.flash("messages",testResult.message)
        res.redirect("dashboard");
    } catch(error) {
        req.flash("messages",error.message)
        res.redirect("dashboard");
    }
})

router.use((req,res,next) => {
	res.redirect("/404")
})

module.exports = router;