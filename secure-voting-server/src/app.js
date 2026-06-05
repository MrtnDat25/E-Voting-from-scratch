import express  from"express";

import cors  from"cors";

import helmet  from"helmet";

import morgan  from"morgan";

import cookieParser  from
  "cookie-parser"
;

import connectDB  from
  "./config/db.js"
;

import routes  from
  "./routes/index.js"
;

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
app.use("/api/results", import("./modules/results/result.route"));
app.use("/api/tally", import("./modules/tally/tally.route"));

export default app;