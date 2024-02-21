const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDb = require("./config/db");
const users = require("./routes/users");
const clubs = require("./routes/travelClubs");
const tours = require("./routes/tourPackage");
const payments = require("./routes/payments");
const bookings = require("./routes/booking");
const auth = require("./routes/auth");
const app = express();
dotenv.config();
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV == "development") {
  app.use(morgan("tiny"));
}

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/clubs", clubs);
app.use("/api/tours", tours);
app.use("/api/payments", payments);
app.use("/api/bookings", bookings);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(
    `The app is listening on ${port} in ${process.env.NODE_ENV} mode`
  );
});
