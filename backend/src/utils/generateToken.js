const crypto = require("crypto");

module.exports = function generateToken() {
  return crypto.randomBytes(32).toString("hex");
};