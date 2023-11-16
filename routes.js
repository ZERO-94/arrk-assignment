const multer = require("multer");
const upload = multer();
const UserRepository = require("./repositories/UserRepository");
const connection = require("./db");

const authHandler = (req, res, next) => {
  const isAuth = req.cookies.isAuth;

  if (!isAuth) {
    res.render("login.ejs");
  } else {
    next();
  }
};

module.exports = function (app) {
  app.get("/", authHandler, function (req, res) {
    res.render("index.ejs");
  });

  app.get("/logout", function (req, res) {
    res.clearCookie("isAuth");
    res.redirect("/");
  });

  app.post("/login", upload.none(), function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const userRepository = new UserRepository(connection);
    userRepository
      .getUserByEmailAndPassword(email, password)
      .then((result) => {
        if (result.length > 0) {
          //set cookie
          res.cookie("isAuth", true, { maxAge: 900000 });
          res.redirect("/");
        } else {
          res.render("login.ejs", {
            error: "Invalid email or password",
            input: { email, password },
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  });
};
