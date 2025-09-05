require("dotenv").config();
const jwt = require("jsonwebtoken");

const { JWT_SECRET = "some-secret-key" } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Autorización requerida" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }

  req.user = payload;
  next();
};
