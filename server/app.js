var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//added dotenv to create and handle environment variables
const dotenv = require("dotenv");
//added cors to stop cross origin resource sharing errors
const cors = require("cors");

//config for environment variables
dotenv.config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
//added route to handle authentication requests
const authRouter = require("./routes/auth");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//added cors: used every request to prevent cross origin resource sharing errors
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/users", usersRouter);
//authentication route
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
