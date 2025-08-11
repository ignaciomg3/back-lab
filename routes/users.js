const express = require('express');
const User = require('../models/User');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *           example: "admin"
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *           example: "admin123"
 *         role:
 *           type: string
 *           enum: [admin, usuario, tecnico, supervisor]
 *           description: Rol del usuario en el sistema
 *           example: "admin"
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: "admin@laboratorio.com"
 *         activo:
 *           type: boolean
 *           description: Estado del usuario
 *           example: true
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios activos
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de usuario
 *         example: "admin"
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo
 *         example: true
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
  try {
    const { username, activo } = req.query;
    let filter = {};

    // Por defecto, solo mostrar usuarios activos
    if (activo !== undefined) {
      filter.activo = activo === 'true';
    } else {
      filter.activo = true;
    }

    if (username) filter.username = username;

    const users = await User.find(filter).select('-password'); // No mostrar contraseñas
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     summary: Obtener un usuario por nombre de usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de usuario
 *         example: "admin"
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Usuario '${req.params.username}' no encontrado`
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el usuario',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: savedUser.getPublicProfile()
    });
  } catch (error) {
    if (error.code === 11000) {
      // Determinar qué campo causó el error de duplicación
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `El ${field} ya está registrado`
      });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Errores de validación',
        details: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al crear el usuario',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/{username}:
 *   put:
 *     summary: Actualizar un usuario por nombre de usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:username', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Usuario '${req.params.username}' no encontrado`
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Errores de validación',
        details: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al actualizar el usuario',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/{username}:
 *   delete:
 *     summary: Desactivar un usuario (soft delete)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de usuario
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:username', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { activo: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Usuario '${req.params.username}' no encontrado`
      });
    }

    res.json({
      success: true,
      message: 'Usuario desactivado exitosamente',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al desactivar el usuario',
      details: error.message
    });
  }
});

module.exports = router;
