const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const errorHandler = require("errorhandler");

const app = express();
const port = 3000;


const isDev = process.env.NODE_ENV !== "production";
const isProd = process.env.NODE_ENV == "production";

// DB setup - Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(
  isProd
    ? "mongodb://<dbuser>:<dbpassword>@ds149905.mlab.com:49905/heroku_xp1d111z"
    : "mongodb://localhost/reddit-clone",
  { useNewUrlParser: true }
);

// app.use(cors());
app.use(logger("dev"));

// Body Parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(
  session({
    secret: "passport-tutorial",
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static("public"));
app.set("view engine", "ejs");

//Set Routes


// const PostRouter = require("./routes/PostRouter");
// const UserRouter = require("./routes/UserRouter");

// Routing
app.get(/^\/(?!api\/.*\/).*/, function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// app.get("/", function(req, res) {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.use("/reddit-clone-api/posts", PostRouter);
require("./models/_setupdb");
require("./config/passport");
app.use(require("./routes"));

app.listen(port, function() {
  console.log(`Node js Express js Tutorial - listening on http://localhost:${port}`);
});
