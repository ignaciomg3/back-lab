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
 *         - nro_informe
 *         - solicitante
 *         - fecha
 *         - estado
 *         - tipo_analisis
 *       properties:
 *         nro_informe:
 *           type: number
 *           description: Número único del informe
 *           example: 39
 *         solicitante:
 *           type: string
 *           description: Empresa o persona que solicita el análisis
 *           example: "AGUAS CORDOBESAS S.A."
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha del análisis
 *           example: "1997-08-07"
 *         responsable:
 *           type: string
 *           nullable: true
 *           description: Responsable del análisis
 *           example: null
 *         estado:
 *           type: string
 *           description: Estado actual del análisis
 *           example: "Hecho"
 *         tipo_analisis:
 *           type: string
 *           description: Tipo de análisis realizado
 *           example: "BACTERIOLOGICO COMPLETO"
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
 *         example: "Hecho"
 *       - in: query
 *         name: solicitante
 *         schema:
 *           type: string
 *         description: Filtrar por solicitante
 *         example: "AGUAS CORDOBESAS S.A."
 *       - in: query
 *         name: tipo_analisis
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de análisis
 *         example: "BACTERIOLOGICO COMPLETO"
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
    const { estado, solicitante, tipo_analisis } = req.query;
    let filter = {};
    
    if (estado) filter.estado = estado;
    if (solicitante) filter.solicitante = new RegExp(solicitante, 'i'); // Búsqueda case-insensitive
    if (tipo_analisis) filter.tipo_analisis = new RegExp(tipo_analisis, 'i');
    
    const analisis = await Analisis.find(filter);
    
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
 * /api/analisis/{nro_informe}:
 *   get:
 *     summary: Obtener un análisis por número de informe
 *     tags: [Análisis]
 *     parameters:
 *       - in: path
 *         name: nro_informe
 *         required: true
 *         schema:
 *           type: number
 *         description: Número del informe
 *         example: 39
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
router.get('/:nro_informe', async (req, res) => {
  try {
    const nro_informe = parseInt(req.params.nro_informe);
    
    if (isNaN(nro_informe)) {
      return res.status(400).json({
        success: false,
        error: 'El número de informe debe ser un número válido'
      });
    }
    
    const analisis = await Analisis.findOne({ nro_informe: nro_informe });
    
    if (!analisis) {
      return res.status(404).json({
        success: false,
        error: `Análisis con número de informe ${nro_informe} no encontrado`
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
 * /api/analisis/{nro_informe}:
 *   put:
 *     summary: Actualizar un análisis por número de informe
 *     tags: [Análisis]
 *     parameters:
 *       - in: path
 *         name: nro_informe
 *         required: true
 *         schema:
 *           type: number
 *         description: Número del informe
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
router.put('/:nro_informe', async (req, res) => {
  try {
    const nro_informe = parseInt(req.params.nro_informe);
    
    if (isNaN(nro_informe)) {
      return res.status(400).json({
        success: false,
        error: 'El número de informe debe ser un número válido'
      });
    }
    
    const analisis = await Analisis.findOneAndUpdate(
      { nro_informe: nro_informe },
      req.body,
      { new: true, runValidators: true }
    );

    if (!analisis) {
      return res.status(404).json({
        success: false,
        error: `Análisis con número de informe ${nro_informe} no encontrado`
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
 * /api/analisis/{nro_informe}:
 *   delete:
 *     summary: Eliminar un análisis por número de informe
 *     tags: [Análisis]
 *     parameters:
 *       - in: path
 *         name: nro_informe
 *         required: true
 *         schema:
 *           type: number
 *         description: Número del informe
 *     responses:
 *       200:
 *         description: Análisis eliminado exitosamente
 *       404:
 *         description: Análisis no encontrado
 */
router.delete('/:nro_informe', async (req, res) => {
  try {
    const nro_informe = parseInt(req.params.nro_informe);
    
    if (isNaN(nro_informe)) {
      return res.status(400).json({
        success: false,
        error: 'El número de informe debe ser un número válido'
      });
    }
    
    const analisis = await Analisis.findOneAndDelete({ nro_informe: nro_informe });

    if (!analisis) {
      return res.status(404).json({
        success: false,
        error: `Análisis con número de informe ${nro_informe} no encontrado`
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
