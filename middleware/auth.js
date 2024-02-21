const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-Token");
  if (!token) {
    return res.status(401).send("Access denied!No token provided");
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decode;
    next();
  } catch (error) {
    res.send(400).send("Invalid token");
  }
};
