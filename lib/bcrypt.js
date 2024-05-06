const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(10);

const hashPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, salt);
};

const validPassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

module.exports = { hashPassword, validPassword };
