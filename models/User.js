class User {
  constructor(fullName, email, password) {
    this._fullName = fullName;
    this._email = email;
    this._password = password;
  }

  set fullName(fullName) {
    this._fullName = fullName;
  }

  get fullName() {
    return this._fullName;
  }

  set email(email) {
    this._email = email;
  }

  get email() {
    return this._email;
  }

  set password(password) {
    this._password = password;
  }

  get password() {
    return this._password;
  }
}

module.exports = User;
