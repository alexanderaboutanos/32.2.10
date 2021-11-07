/** @format */

const express = require("express");
const routes = require("./routes");
const expressError = require("./expressError");
const app = express();

app.use(express.json());

//  apply a prefix to every route in routes
app.use("/items", routes);

// 404 handler
app.use(function (req, res) {
  return new ExpressError("Not Found", 404);
});

// generic error handler
app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status,
    },
  });
});
// end generic handler
app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
