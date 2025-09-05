const { logRequest } = require("../utils/logger");

const maskSensitive = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const copy = JSON.parse(JSON.stringify(obj));
  if (copy.password) copy.password = "[MASKED]";
  if (copy.token) copy.token = "[MASKED]";
  if (copy.authorization) copy.authorization = "[MASKED]";
  return copy;
};

module.exports = (req, res, next) => {
  const { method, originalUrl: url, headers, body } = req;

  const safeHeaders = { ...headers };
  if (safeHeaders.authorization) safeHeaders.authorization = "[MASKED]";

  const entry = {
    timestamp: new Date().toISOString(),
    event: "request",
    method,
    url,
    ip: req.ip || req.connection.remoteAddress,
    headers: safeHeaders,
    body: maskSensitive(body),
  };

  logRequest(entry).catch(() => {});
  next();
};
