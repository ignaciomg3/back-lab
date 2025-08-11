const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión y obtener un token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Usuario y contraseña son requeridos'
    });
  }

  try {
    const user = await User.findOne({ username, activo: true });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario o contraseña incorrectos'
      });
    }

    // Comparar contraseña en texto plano (solo temporal, no seguro)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Usuario o contraseña incorrectos'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error en el login',
      details: error.message
    });
  }
});

module.exports = router;
