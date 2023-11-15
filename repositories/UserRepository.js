class UserRepository {
  constructor(connection) {
    this._connection = connection;
  }

  createUser(user) {
    return new Promise((resolve, reject) => {
      this._connection.query(
        "INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)",
        [user.fullName, user.email, user.password],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
}

module.exports = UserRepository;
