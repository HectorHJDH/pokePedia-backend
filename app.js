require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { errors: celebrateErrors } = require("celebrate");
const cors = require("cors");

const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const usersRouter = require("./routes/users");

const requestLogger = require("./middlewares/requestLogger");
const errorLogger = require("./middlewares/errorLogger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://hectorvmpokepedia.chickenkiller.com",
      "https://www.hectorvmpokepedia.chickenkiller.com",
    ],
  })
);

const { PORT, MONGO_URL } = process.env;

// Middleware para parsear JSON
app.use(express.json());

// Logger de peticiones
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});
// ─── Rutas públicas ────────────────────────────────────────────────────
app.post("/signup", createUser);
app.post("/signin", login);

// ─── Middleware de autorización JWT ────────────────────────────────────
app.use(auth);

// ─── Rutas protegidas por JWT ──────────────────────────────────────────
app.use("/users", usersRouter);

// ─── Manejo de rutas no encontradas ────────────────────────────────────
app.use((req, res, next) => {
  const err = new Error("Recurso solicitado no encontrado");
  err.statusCode = 404;
  next(err);
});

// ─── Celebrate: convierte errores de validación Joi en 400 ──────────────
app.use(celebrateErrors());

// ─── Registrar errores (no responde al cliente, delega con next) ───────
app.use(errorLogger);

// ─── Middleware centralizado de errores (responde al cliente) ──────────
app.use(errorHandler);

// ─── Conexión a MongoDB y arranque ─────────────────────────────────────
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`✅ Conectado a MongoDB en ${MONGO_URL}`);
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });
