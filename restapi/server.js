//imports
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const routes = require("./routes/routes.js");

//initialize app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

const server = app.listen(3000, () => {
  console.log("Started on port 3000");
});

module.exports = { app };
