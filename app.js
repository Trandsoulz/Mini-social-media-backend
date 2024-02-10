const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const InitialiseDB = require("./db/db");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const globalError = require("./controllers/errorController");
const CatchAsyncErrors = require("./utils/CatchAsyncError");
const AppError = require("./utils/AppError");

const app = express();
const PORT = process.env.PORT || 8000;
const config = process.env;

console.log(`We're in the ${process.env.NODE_ENV} environment`);
//! Initialise database
InitialiseDB();

// ! Enable cors, from just this origin
const corsOptions = {
  origin: ["http://localhost:3000", "http://192.168.135.242:3000", "https://viewstock-socials.vercel.app"],
  optionsSuccessStatus: 200,
  exposedHeaders: "Authorization",
};
app.use(cors(corsOptions));

// ! HTTP logger for any incoming requests
if (config.NODE_ENV === "dev") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ! Allow JSON.body to parse through
app.use(express.json({ limit: "1024kb" }));

//! Routes
app.use("/photoapp/v1/auth", authRoute);
app.use("/photoapp/v1/post", postRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.url}, on this server|`, 404));
});

app.use(globalError);

app.listen(PORT, () => {
  console.log(`Listening on PORT, ${PORT}...`);
});
