if(process.env.Node_ENV != 'production'){
  require("dotenv").config();
}

console.log(process.env.MAP_TOKEN);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

// Connect to MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// SESSION & FLASH
const sessionOptions = {
  secret: "mysupersecretecode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 7*24*60*60*1000,
  }
};
app.use(session(sessionOptions));
app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ROUTES
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter); // Nested reviews router
app.use("/", userRouter);

// 404 handler
//app.all("*", (req,res,next) => next(new ExpressError(404,"Page not found")));

// General error handler
// app.use((err, req, res, next) => {
//   const { statusCode = 500 } = err;
//   if (!err.message) err.message = "Something went wrong!";
//   res.status(statusCode).render("error", { err });
// });
app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).send(err.message);
});

// SERVER
app.listen(8080, () => {
  console.log("Server running on port 8080");
});