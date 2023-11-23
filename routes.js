const multer = require("multer");
const upload = multer();
const UserRepository = require("./repositories/UserRepository");
const MessageRepository = require("./repositories/MessageRepository");
const connection = require("./db");
const Message = require("./models/Message");
const User = require("./models/User");


const authHandler = (req, res, next) => {
  const isAuth = !!req.cookies.email;
  console.log("🚀 ~ file: routes.js:9 ~ authHandler ~ isAuth:", isAuth);

  if (!isAuth) {
    res.render("login.ejs");
  } else {
    next();
  }
};

//HTTP
//GET -> không có body -> get view -> data có cần bảo mật không? -> data có dài không? -> cái request có create hay update data không? -> delete thì vẫn được dùng GET -> GET
//POST -> có body

module.exports = function (app) {
  app.get("/", authHandler, function (req, res) {
    res.render("index.ejs", { list: res, email: req.cookies.email });
  });
 
  app.get("/signup", (req,res, next) => {
    res.render('signup')
  })
  app.post('/signup', upload.none(), function(req,res) {
    const inputData = {
    fullName: req.body.fullName,
    email:  req.body.email,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
    }
    const userRepository = new UserRepository(connection)
    userRepository
      .getUserByEmail(inputData.email)
      .then((result) => {
        let msg = "";
        if (result.length>0) {
          msg = inputData.email + " was already exist";
        } else if (inputData.password != inputData.confirm_password) {
          msg = "Password and Confirm Password do not match";
        } else {
          const user = new User(inputData.fullName, inputData.email, inputData.password)
          userRepository.createUser(user)
          res.redirect("/");
          res.render('login');
        }
        res.render('signup',{alertMsg: msg});
      })
});
  app.get("/messages", authHandler, () => {
    res.send(res);
  });

  app.get("/logout", function (req, res) {
    res.clearCookie("email");
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
          res.cookie("email", email, { maxAge: 900000 });
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
  
  app.get("/compose-message", authHandler, function (req, res) {
    const userRepository = new UserRepository(connection);

    userRepository.getAllUsers().then((result) => {
      res.render("compose.ejs", {
        emails: result
          .map((el) => el.email)
          .filter((str) => str !== req.cookies.email),
      });
    });
  });

  app.get("/message/:id", authHandler, function (req, res) {
    const id = req.params.id;
    const messageRepository = new MessageRepository(connection);

    messageRepository
      .getEmailById(id)
      .then((result) => {
        console.log("🚀 ~ file: routes.js:73 ~ .then ~ result:", result);
        res.render("messageDetail.ejs", { data: result });
      })
      .catch((err) => {
        res.render("messageDetail.ejs");
      });
  });

  app.post("/compose-message", authHandler, upload.none(), function (req, res) {
    const messageRepository = new MessageRepository(connection);
    const userRepository = new UserRepository(connection);
    const sender = req.cookies.email;

    userRepository.getAllUsers().then((users) => {
      if (!req.body.subject) {
        res.render("compose.ejs", {
          error: "Subject is required",
          input: {
            receiver: req.body.receiver,
            subject: req.body.subject,
            message: req.body.message,
          },
          emails: users
            .map((el) => el.email)
            .filter((str) => str !== req.cookies.email),
        });
        return;
      }

      if (!req.body.receiver) {
        res.render("compose.ejs", {
          error: "Receiver is required",
          input: {
            receiver: req.body.receiver,
            subject: req.body.subject,
            message: req.body.message,
          },
          emails: users
            .map((el) => el.email)
            .filter((str) => str !== req.cookies.email),
        });
        return;
      }

      userRepository.getUserByEmail(req.body.receiver).then((result) => {
        if (!result) {
          res.render("compose.ejs", {
            error: "Receiver does not exist",
            input: {
              receiver: req.body.receiver,
              subject: req.body.subject,
              message: req.body.message,
            },
            emails: users
              .map((el) => el.email)
              .filter((str) => str !== req.cookies.email),
          });
          return;
        }

        const newMessage = new Message(
          sender,
          req.body.receiver,
          req.body.subject,
          req.body.message,
          new Date()
        );

        messageRepository
          .createMessage(newMessage)
          .then((result) => {
            res.redirect("/");
          })
          .catch((err) => {
            console.log("🚀 ~ file: routes.js:101 ~ err:", err);
            res.render("compose.ejs", {
              error: "Something went wrong",
              input: {
                receiver: req.body.receiver,
                subject: req.body.subject,
                message: req.body.message,
              },
            });
          });
      });
    });
  });

  app.get("/api/messages", authHandler, function (req, res) {
    const receiver = req.cookies.email;
    const messageRepository = new MessageRepository(connection);
    messageRepository
      .getEmailList(receiver, req.query.pageNumber, req.query.pageSize)
      .then((result) => {
        res.json(result);
      });
  });

  app.get("/outbox", authHandler, function (req, res) {
    res.render("outbox.ejs", { email: req.cookies.email });
  });

  app.get("/api/outbox", authHandler, function (req, res) {
    const sender = req.cookies.email;
    const messageRepository = new MessageRepository(connection);
    messageRepository
      .getEmailBySender(sender, req.query.pageNumber, req.query.pageSize)
      .then((result) => {
        res.json(result);
      });
  });
};
