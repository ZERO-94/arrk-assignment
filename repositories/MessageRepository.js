//create MessageRepository class with constructor and createMessage method
class MessageRepository {
  constructor(connection) {
    this._connection = connection;
  }

  createMessage(message) {
    return new Promise((resolve, reject) => {
      this._connection.query(
        "INSERT INTO messages (sender, receiver, message, sendAt, readAt) VALUES (?, ?, ?, ?, ?)",
        [
          message.sender,
          message.receiver,
          message.message,
          message.sendAt,
          message.readAt,
        ],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  getEmailList(email, page, limit) {
    return new Promise((resolve, reject) => {
      this._connection.query(
        "SELECT DISTINCT sender FROM messages WHERE receiver = ? ORDER BY sendAt DESC LIMIT ? OFFSET ?",
        [email, limit, (page - 1) * limit],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
}

module.exports = MessageRepository;
