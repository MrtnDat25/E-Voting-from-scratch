import express  from "express";

import cors  from "cors";

import helmet  from "helmet";

import morgan  from "morgan";

import cookieParser  from 
  "cookie-parser"
;

import connectDB  from
  "./config/db.js"
;

import routes  from
  "./routes/index.js"
;
import resultRoutes from "./modules/results/result.route.js";
import tallyRoutes from "./modules/tally/tally.route.js";
import dashboardRoutes
from "./modules/dashboard/dashboard.route.js";

import blockchainRoutes
from "./modules/blockchain/blockchain.route.js";

import swaggerUi
from "swagger-ui-express";

import swaggerSpec
from "./config/swagger.js";

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
app.use("/api/results", resultRoutes);
app.use("/api/tally", tallyRoutes);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/blockchain",
  blockchainRoutes
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


export default app;