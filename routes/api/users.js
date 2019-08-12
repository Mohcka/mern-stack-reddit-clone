const passport = require("passport");
const router = require("express").Router();
const Users = require('../../models/Users.model');

//TODO:
// Get User by id
router.get('/user/:id', (req, res) => {
  Users.findById(req.params.id, "_id username", (err, user) => {
    if(err)  {
      console.error(err);
      return res.status(500).json({error: "Internal Server Error"});
    }

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  })
});

//
router.post("/signup", (req, res, next) => {
  const {
    body: { username, password }
  } = req;

  if (!username) {
    return res.status(422).json({
      errors: {
        message: "username is required"
      }
    });
  }

  if (!password) {
    return res.status(422).json({
      errors: {
        message: "password is required"
      }
    });
  }

  Users.findOne({ username: username }, (err, user) => {
    if (err) res.send(err);

    if (user) {
      return res.status(422).json({
        errors: {
          message: "username is taken"
        }
      });
    } else {
      const finalUser = new Users({ username: username, password: password });

      finalUser.setPassword(password);

      finalUser.save();

      req.login(finalUser, err => {
        if (err) return next(err);

        return res.json({
          success: {
            message: "Succesfully signed up!"
          }
        });
      });
    }
  });
});

//POST login route (optional, everyone has access)
router.post("/login", passport.authenticate("local"), (req, res, next) => {
  res.json({ user: { username: req.user.username, _id: req.user._id } });
});

//GET current route (required, only authenticated users have access)
router.get(
  "/current",
  passport.authenticate("local", {
    failureRedirect: "/",
    failureFlash: "Bad Credentials"
  }),
  (req, res, next) => {
    const {
      payload: { id }
    } = req;

    return Users.findById(id).then(user => {
      if (!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
  }
);

router.get("/logout", (req, res, next) => {
  req.logout();

  res.json({});
});

// Respond with user if logged in, if not, respond with null
router.get("/user", (req, res, next) => {
  res.json(
    req.user ? { user: { _id: req.user._id, username: req.user.username } } : {}
  );
});

module.exports = router;
