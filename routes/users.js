const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const { validateURL } = require("../utils/validate");
const {
  getUsers,
  getUserById,
  getCurrentUser,
} = require("../controllers/users");

const router = express.Router();

// GET /users/me — datos del usuario actual
router.get("/me", getCurrentUser);

// Listar todos los usuarios
router.get("/", getUsers);

// Obtener un usuario por ID
router.get(
  "/:userId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById
);

module.exports = router;
