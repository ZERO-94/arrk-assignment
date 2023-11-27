require("dotenv").config();

const connection = require("./db");
const User = require("./models/User");
const UserRepository = require("./repositories/UserRepository");
const Message = require("./models/Message");
const MessageRepository = require("./repositories/MessageRepository");

function generateMessage() {
  const messages = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

connection.query(
  "CREATE TABLE IF NOT EXISTS users (fullName VARCHAR(255), email VARCHAR(255) PRIMARY KEY, password VARCHAR(255))",
  (err, result) => {
    if (err) throw err;
    connection.query(
      "CREATE TABLE IF NOT EXISTS messages (id INT AUTO_INCREMENT PRIMARY KEY, sender VARCHAR(255), receiver VARCHAR(255), subject TEXT, message TEXT, sendAt DATETIME, readAt DATETIME, receiverDeleted BOOLEAN NOT NULL default 0, senderDeleted BOOLEAN NOT NULL default 0, FOREIGN KEY (sender) REFERENCES users(email), FOREIGN KEY (receiver) REFERENCES users(email))",
      (err, result) => {
        if (err) throw err;
        const user1 = new User("John Doe", "john@a.com", "123456");
        const user2 = new User("Jane Doe", "jane@a.com", "123456");
        const user3 = new User("Bob Doe", "a@a.com", "123456");
        const userRepository = new UserRepository(connection);
        Promise.all([
          userRepository.createUser(user1),
          userRepository.createUser(user2),
          userRepository.createUser(user3),
        ])
          .then((result) => {
            const messageRepository = new MessageRepository(connection);
            const messageData = [
              new Message(
                user1.email,
                user2.email,
                generateMessage(),
                generateMessage(),
                new Date(),
                new Date()
              ),
              new Message(
                user2.email,
                user1.email,
                generateMessage(),
                generateMessage(),
                new Date()
              ),
              new Message(
                user1.email,
                user3.email,
                generateMessage(),
                generateMessage(),
                new Date()
              ),
              new Message(
                user3.email,
                user1.email,
                generateMessage(),
                null,
                new Date(),
                new Date()
              ),
              new Message(
                user2.email,
                user3.email,
                generateMessage(),
                generateMessage(),
                new Date(),
                new Date()
              ),
              new Message(
                user3.email,
                user2.email,
                generateMessage(),
                null,
                new Date()
              ),
              new Message(
                user3.email,
                user2.email,
                generateMessage(),
                generateMessage(),
                new Date(),
                new Date()
              ),
              new Message(
                user3.email,
                user2.email,
                generateMessage(),
                null,
                new Date()
              ),
            ];

            // Create messages with Promise all
            Promise.all(
              messageData.map((data) => {
                return messageRepository.createMessage(data);
              })
            )
              .then((result) => {
                process.exit();
              })
              .catch((err) => {
                console.log(err);
                process.exit();
              });
          })
          .catch((err) => {
            console.log(err);
            process.exit();
          });
      }
    );
  }
);
