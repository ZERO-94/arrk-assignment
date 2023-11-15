var express = require("express");
var app = express();

//setup dotenv
require("dotenv").config();

app.set("view engine", "ejs");

// index page
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.listen(8080);
console.log("Server is listening on port 8080");
