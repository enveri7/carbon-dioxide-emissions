//imports
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const routes = require("./routes/routes.js");

//initialize app
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

const server = app.listen(8080, () => {
  console.log("Started on port 8080");
});

module.exports = { app };
