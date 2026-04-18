function log(level, message, data = null) {
  const time = new Date().toISOString();

  const base = `[${time}] [${level.toUpperCase()}] ${message}`;

  if (data) {
    console.log(base, data);
  } else {
    console.log(base);
  }
}

module.exports = {
  info: (msg, data) => log("info", msg, data),
  error: (msg, data) => log("error", msg, data),
  warn: (msg, data) => log("warn", msg, data),
};