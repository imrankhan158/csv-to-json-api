const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const httpStatus = require("http-status");
const morgan = require("./config/morgan");
const { postgres } = require("./config/postgres");
const config = require("./config/config");
const routes = require("./routes/v1");
const errorHandler = require("./middlewares/error");
const ApiError = require("./utils/ApiError");

const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

app.use(cookieParser());

// connect to postgres database
app.use((req, _, next) => {
  req.postgres = postgres;
  next();
});

// v1 api routes
app.use("/api/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// handle error
app.use(errorHandler);

module.exports = app;
