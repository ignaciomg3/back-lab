const express = require('express');
const { Muestras1997, Muestras1999 } = require('../models/Muestras');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Muestra:
 *       type: object
 *       required:
 *         - numero_muestra
 *         - fecha_toma
 *         - origen
 *         - ubicacion
 *         - tipo_muestra
 *         - responsable_toma
 *         - año_campana
 *       properties:
 *         numero_muestra:
 *           type: string
 *           description: Número único de la muestra
 *         fecha_toma:
 *           type: string
 *           format: date
 *           description: Fecha de toma de la muestra
 *         origen:
 *           type: string
 *           description: Origen de la muestra
 *         ubicacion:
 *           type: string
 *           description: Ubicación de la toma
 *         tipo_muestra:
 *           type: string
 *           enum: [agua, suelo, aire, alimento, otro]
 *           description: Tipo de muestra
 *         estado_muestra:
 *           type: string
 *           enum: [recibida, en_proceso, analizada, archivada]
 *         temperatura_conservacion:
 *           type: number
 *           description: Temperatura de conservación
 *         ph:
 *           type: number
 *           description: pH de la muestra
 *         responsable_toma:
 *           type: string
 *           description: Responsable de la toma
 *         observaciones:
 *           type: string
 *           description: Observaciones adicionales
 *         año_campana:
 *           type: number
 *           description: Año de la campaña
 */

/**
 * @swagger
 * /api/muestras/1997:
 *   get:
 *     summary: Obtener todas las muestras de 1997
 *     tags: [Muestras 1997]
 *     parameters:
 *       - in: query
 *         name: tipo_muestra
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de muestra
 *       - in: query
 *         name: estado_muestra
 *         schema:
 *           type: string
 *         description: Filtrar por estado
 *       - in: query
 *         name: origen
 *         schema:
 *           type: string
 *         description: Filtrar por origen
 *     responses:
 *       200:
 *         description: Lista de muestras de 1997
 */
router.get('/1997', async (req, res) => {
  try {
    const { tipo_muestra, estado_muestra, origen } = req.query;
    let filter = {};
    
    if (tipo_muestra) filter.tipo_muestra = tipo_muestra;
    if (estado_muestra) filter.estado_muestra = estado_muestra;
    if (origen) filter.origen = new RegExp(origen, 'i');
    
    const muestras = await Muestras1997.find(filter).select('-__v');
    
    res.json({
      success: true,
      count: muestras.length,
      data: muestras
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener muestras de 1997',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/muestras/1999:
 *   get:
 *     summary: Obtener todas las muestras de 1999
 *     tags: [Muestras 1999]
 *     parameters:
 *       - in: query
 *         name: tipo_muestra
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de muestra
 *       - in: query
 *         name: estado_muestra
 *         schema:
 *           type: string
 *         description: Filtrar por estado
 *       - in: query
 *         name: origen
 *         schema:
 *           type: string
 *         description: Filtrar por origen
 *     responses:
 *       200:
 *         description: Lista de muestras de 1999
 */
router.get('/1999', async (req, res) => {
  try {
    const { tipo_muestra, estado_muestra, origen } = req.query;
    let filter = {};
    
    if (tipo_muestra) filter.tipo_muestra = tipo_muestra;
    if (estado_muestra) filter.estado_muestra = estado_muestra;
    if (origen) filter.origen = new RegExp(origen, 'i');
    
    const muestras = await Muestras1999.find(filter).select('-__v');
    
    res.json({
      success: true,
      count: muestras.length,
      data: muestras
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener muestras de 1999',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/muestras/1997/{id}:
 *   get:
 *     summary: Obtener una muestra de 1997 por ID
 *     tags: [Muestras 1997]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Muestra encontrada
 */
router.get('/1997/:id', async (req, res) => {
  try {
    const muestra = await Muestras1997.findById(req.params.id).select('-__v');
    
    if (!muestra) {
      return res.status(404).json({
        success: false,
        error: 'Muestra no encontrada'
      });
    }

    res.json({
      success: true,
      data: muestra
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener la muestra',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/muestras/1999/{id}:
 *   get:
 *     summary: Obtener una muestra de 1999 por ID
 *     tags: [Muestras 1999]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Muestra encontrada
 */
router.get('/1999/:id', async (req, res) => {
  try {
    const muestra = await Muestras1999.findById(req.params.id).select('-__v');
    
    if (!muestra) {
      return res.status(404).json({
        success: false,
        error: 'Muestra no encontrada'
      });
    }

    res.json({
      success: true,
      data: muestra
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener la muestra',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/muestras/1997:
 *   post:
 *     summary: Crear una nueva muestra de 1997
 *     tags: [Muestras 1997]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Muestra'
 *     responses:
 *       201:
 *         description: Muestra creada exitosamente
 */
router.post('/1997', async (req, res) => {
  try {
    const muestra = new Muestras1997({...req.body, año_campana: 1997});
    const savedMuestra = await muestra.save();
    
    res.status(201).json({
      success: true,
      message: 'Muestra de 1997 creada exitosamente',
      data: savedMuestra
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'El número de muestra ya existe'
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
      error: 'Error al crear la muestra',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/muestras/1999:
 *   post:
 *     summary: Crear una nueva muestra de 1999
 *     tags: [Muestras 1999]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Muestra'
 *     responses:
 *       201:
 *         description: Muestra creada exitosamente
 */
router.post('/1999', async (req, res) => {
  try {
    const muestra = new Muestras1999({...req.body, año_campana: 1999});
    const savedMuestra = await muestra.save();
    
    res.status(201).json({
      success: true,
      message: 'Muestra de 1999 creada exitosamente',
      data: savedMuestra
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'El número de muestra ya existe'
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
      error: 'Error al crear la muestra',
      details: error.message
    });
  }
});

module.exports = router;
