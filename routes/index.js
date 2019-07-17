const express = require("express");
const router = express.Router();

router.get("/", (req, res) =>
  res.render("index", {
    title: `Welcome ${req.user ? req.user.email : "Stranger"}`,
    user: req.user
  })
);

router.get("/login", (req, res) =>{ 
  
  res.render("login", { title: "Sign Up/Login", flashError: req.flash("error") });
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

router.use("/api", require("./api"));

module.exports = router;
