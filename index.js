const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

//setup dotenv
require("dotenv").config();

//set cookie
app.use(cookieParser());

//set view
app.set("view engine", "ejs");

//routes
require("./routes.js")(app);

app.listen(8000);
console.log("Server is listening on port 8000");
