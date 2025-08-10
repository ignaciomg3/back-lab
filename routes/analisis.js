const express = require('express');
const Analisis = require('../models/Analisis');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Analisis:
 *       type: object
 *       required:
 *         - numero_analisis
 *         - tipo_analisis
 *         - laboratorio
 *         - tecnico_responsable
 *       properties:
 *         numero_analisis:
 *           type: string
 *           description: Número único del análisis
 *         fecha_analisis:
 *           type: string
 *           format: date
 *           description: Fecha del análisis
 *         tipo_analisis:
 *           type: string
 *           description: Tipo de análisis realizado
 *         laboratorio:
 *           type: string
 *           description: Laboratorio donde se realizó
 *         tecnico_responsable:
 *           type: string
 *           description: Técnico responsable del análisis
 *         observaciones:
 *           type: string
 *           description: Observaciones adicionales
 *         estado:
 *           type: string
 *           enum: [pendiente, en_proceso, completado, cancelado]
 *           description: Estado actual del análisis
 */

/**
 * @swagger
 * /api/analisis:
 *   get:
 *     summary: Obtener todos los análisis
 *     tags: [Análisis]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtrar por estado
 *       - in: query
 *         name: laboratorio
 *         schema:
 *           type: string
 *         description: Filtrar por laboratorio
 *     responses:
 *       200:
 *         description: Lista de análisis
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
 *                     $ref: '#/components/schemas/Analisis'
 */
router.get('/', async (req, res) => {
  try {
    const { estado, laboratorio } = req.query;
    let filter = {};
    
    if (estado) filter.estado = estado;
    if (laboratorio) filter.laboratorio = laboratorio;
    
    const analisis = await Analisis.find(filter).select('-__v');
    
    res.json({
      success: true,
      count: analisis.length,
      data: analisis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener análisis',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/analisis/{id}:
 *   get:
 *     summary: Obtener un análisis por ID
 *     tags: [Análisis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del análisis
 *     responses:
 *       200:
 *         description: Análisis encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Analisis'
 *       404:
 *         description: Análisis no encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const analisis = await Analisis.findById(req.params.id).select('-__v');
    
    if (!analisis) {
      return res.status(404).json({
        success: false,
        error: 'Análisis no encontrado'
      });
    }

    res.json({
      success: true,
      data: analisis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el análisis',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/analisis:
 *   post:
 *     summary: Crear un nuevo análisis
 *     tags: [Análisis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Analisis'
 *     responses:
 *       201:
 *         description: Análisis creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', async (req, res) => {
  try {
    const analisis = new Analisis(req.body);
    const savedAnalisis = await analisis.save();
    
    res.status(201).json({
      success: true,
      message: 'Análisis creado exitosamente',
      data: savedAnalisis
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'El número de análisis ya existe'
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
      error: 'Error al crear el análisis',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/analisis/{id}:
 *   put:
 *     summary: Actualizar un análisis
 *     tags: [Análisis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Analisis'
 *     responses:
 *       200:
 *         description: Análisis actualizado exitosamente
 *       404:
 *         description: Análisis no encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const analisis = await Analisis.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!analisis) {
      return res.status(404).json({
        success: false,
        error: 'Análisis no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Análisis actualizado exitosamente',
      data: analisis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el análisis',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/analisis/{id}:
 *   delete:
 *     summary: Eliminar un análisis
 *     tags: [Análisis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Análisis eliminado exitosamente
 *       404:
 *         description: Análisis no encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const analisis = await Analisis.findByIdAndDelete(req.params.id);

    if (!analisis) {
      return res.status(404).json({
        success: false,
        error: 'Análisis no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Análisis eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el análisis',
      details: error.message
    });
  }
});

module.exports = router;
