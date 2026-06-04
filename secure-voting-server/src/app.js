const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const morgan = require("morgan");

const cookieParser = require(
  "cookie-parser"
);

const connectDB = require(
  "./config/db"
);

const routes = require(
  "./routes"
);

const app = express();

connectDB();

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));


app.use(cookieParser());

app.use("/api", routes);
app.use("/api/results", require("./modules/results/result.route"));
app.use("/api/tally", require("./modules/tally/tally.route"));

module.exports = app;