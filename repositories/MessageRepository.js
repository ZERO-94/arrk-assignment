//create MessageRepository class with constructor and createMessage method
class MessageRepository {
  constructor(connection) {
    this._connection = connection;
  }

  createMessage(message) {
    return new Promise((resolve, reject) => {
      this._connection.query(
        "INSERT INTO messages (sender, receiver, subject, message, sendAt, readAt) VALUES (?, ?, ?, ?, ?, ?)",
        [
          message.sender,
          message.receiver,
          message.subject,
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

  getEmailById(id) {
    return new Promise((resolve, reject) => {
      this._connection.query(
        "SELECT * FROM messages WHERE id = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  }

  getEmailBySender(sender, page, limit) {
    return new Promise((resolve, reject) => {
      let numRows;
      let numPerPage = parseInt(limit, 10) || 5;
      let pageNumber = parseInt(page, 10) || 1;
      let numPages;
      this._connection.query(
        "SELECT count(*) as numRows FROM messages WHERE sender = ? AND senderDeleted = 0",
        [sender],
        (err, results) => {
          console.log(
            "🚀 ~ file: MessageRepository.js:36 ~ MessageRepository ~ returnnewPromise ~ results:",
            results
          );
          if (err) reject(err);
          numRows = results[0].numRows;
          numPages = Math.ceil(numRows / numPerPage);
          console.log("number of pages:", numPages);
          this._connection.query(
            "SELECT * FROM messages WHERE sender = ? AND senderDeleted = 0 ORDER BY sendAt DESC LIMIT ? OFFSET ?",
            [sender, numPerPage, (pageNumber - 1) * numPerPage],
            (err, result) => {
              if (err) reject(err);
              resolve({
                items: result,
                pageNumber: pageNumber,
                pageSize: numPerPage,
                totalPage: numPages,
                total: numRows,
              });
            }
          );
        }
      );
    });
  }

  getEmailList(receiver, page, limit) {
    return new Promise((resolve, reject) => {
      let numRows;
      let numPerPage = parseInt(limit, 10) || 5;
      let pageNumber = parseInt(page, 10) || 1;
      let numPages;
      this._connection.query(
        "SELECT count(*) as numRows FROM messages WHERE receiver = ? AND receiverDeleted = 0",
        [receiver],
        (err, results) => {
          console.log(
            "🚀 ~ file: MessageRepository.js:36 ~ MessageRepository ~ returnnewPromise ~ results:",
            results
          );
          if (err) reject(err);
          numRows = results[0].numRows;
          numPages = Math.ceil(numRows / numPerPage);
          console.log("number of pages:", numPages);
          this._connection.query(
            "SELECT * FROM messages WHERE receiver = ? AND receiverDeleted = 0 ORDER BY sendAt DESC LIMIT ? OFFSET ?",
            [receiver, numPerPage, (pageNumber - 1) * numPerPage],
            (err, result) => {
              if (err) reject(err);
              resolve({
                items: result,
                pageNumber: pageNumber,
                pageSize: numPerPage,
                totalPage: numPages,
                total: numRows,
              });
            }
          );
        }
      );
    });
  }

  deleteListOfEmailByReceiverEmail(receiverEmail, emailList) {
    return new Promise((resolve, reject) => {
      this._connection.query(
        "UPDATE messages SET receiverDeleted = 1 WHERE receiver = ? AND id IN (?)",
        [receiverEmail, emailList],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  deleteListOfEmailBySenderEmail(senderEmail, emailList) {
    return new Promise((resolve, reject) => {
      this._connection.query(
        "UPDATE messages SET senderDeleted = 1 WHERE sender = ? AND id IN (?)",
        [senderEmail, emailList],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
}

module.exports = MessageRepository;
