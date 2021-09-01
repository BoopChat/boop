var createError = require("http-errors");
const express = require("express");
const path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//environment variables configuration
const dotenv = require("dotenv");
dotenv.config();

//Server routes
var indexRouter = require("./routes/index");
// var contactsRouter = require("./router/contacts");
// var conversationsRouter = require("./router/conversations");
// var messagesRouter = require("./router/messages");
// var participantsRouter = require("./router/participants");
// var signinOptionsRouter = require("./router/signinOptions");
var usersRouter = require("./routes/users");
var LoginAuthRouter = require("./routes/loginAuth");//handles login requests


var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//cors
const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use("/contacts", contactsRouter);
// app.use("/conversations", conversationsRouter);
// app.use("/messages", messagesRouter);
// app.use("/participants", participantsRouter);
// app.use("/signinOptions", signinOptionsRouter);
app.use("/users", usersRouter);
app.use("/login/auth", LoginAuthRouter);

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
