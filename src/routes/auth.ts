import { Router } from "express";
import jwt from "jsonwebtoken";
import pool from "../database";

const router = Router();

// Registrar usuario (solo username)
router.post("/register", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username es requerido' });
    }

    // Verificar si el usuario ya existe
    const [existingUsers]: any = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    // Crear nuevo usuario
    const [result]: any = await pool.query(
      "INSERT INTO users (username) VALUES (?)",
      [username]
    );

    const userId = result.insertId;

    // Generar token
    const token = jwt.sign(
      { userId, username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuario registrado",
      token,
      user: { id: userId, username }
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Login (solo username)
router.post("/login", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username es requerido' });
    }

    // Buscar usuario
    const [users]: any = await pool.query(
      "SELECT id, username FROM users WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = users[0];

    // Generar token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;