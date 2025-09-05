const { logError } = require("../utils/logger");

const maskSensitive = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const copy = JSON.parse(JSON.stringify(obj));
  if (copy.password) copy.password = "[MASKED]";
  return copy;
};

module.exports = (err, req, res, next) => {
  const { method, originalUrl: url } = req;
  const statusCode = err.statusCode || 500;

  const entry = {
    timestamp: new Date().toISOString(),
    event: "error",
    message: err.message,
    statusCode,
    method,
    url,
    body: maskSensitive(req.body),
    headers: {
      authorization: req.headers.authorization ? "[MASKED]" : undefined,
    },
    stack: err.stack,
  };

  logError(entry).catch(() => {});

  next(err);
};
