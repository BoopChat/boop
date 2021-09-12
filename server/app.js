var createError = require("http-errors");
const express = require("express");
const path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const passport = require("passport");

//environment variables configuration
const dotenv = require("dotenv");
dotenv.config();

//Server routes
var indexRouter = require("./routes/index");
var contactsRouter = require("./routes/contacts");
var conversationsRouter = require("./routes/conversations");
var messagesRouter = require("./routes/messages");
var signinOptionsRouter = require("./routes/signinOptions");
var LoginAuthRouter = require("./routes/loginAuth"); //handles login requests

var app = express();

// MAY NOT BE NEEDED
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/signinOptions", signinOptionsRouter);
app.use("/api/login/auth", LoginAuthRouter);

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
