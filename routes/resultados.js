const express = require('express');
const ResultadosMuestras = require('../models/ResultadosMuestras');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ResultadosMuestras:
 *       type: object
 *       required:
 *         - id_muestra
 *         - id_analisis
 *         - parametro
 *         - valor
 *         - unidad
 *       properties:
 *         id_muestra:
 *           type: string
 *           description: ID de la muestra
 *         id_analisis:
 *           type: string
 *           description: ID del análisis
 *         parametro:
 *           type: string
 *           description: Parámetro analizado
 *         valor:
 *           type: string
 *           description: Valor del resultado
 *         unidad:
 *           type: string
 *           description: Unidad de medida
 *         limite_inferior:
 *           type: number
 *           description: Límite inferior aceptable
 *         limite_superior:
 *           type: number
 *           description: Límite superior aceptable
 *         estado_resultado:
 *           type: string
 *           enum: [normal, fuera_rango, critico]
 *         metodo_analisis:
 *           type: string
 *           description: Método utilizado para el análisis
 *         observaciones:
 *           type: string
 *           description: Observaciones adicionales
 */

/**
 * @swagger
 * /api/resultados:
 *   get:
 *     summary: Obtener todos los resultados de muestras
 *     tags: [Resultados]
 *     parameters:
 *       - in: query
 *         name: id_muestra
 *         schema:
 *           type: string
 *         description: Filtrar por ID de muestra
 *       - in: query
 *         name: id_analisis
 *         schema:
 *           type: string
 *         description: Filtrar por ID de análisis
 *       - in: query
 *         name: estado_resultado
 *         schema:
 *           type: string
 *         description: Filtrar por estado del resultado
 *     responses:
 *       200:
 *         description: Lista de resultados
 */
router.get('/', async (req, res) => {
  try {
    const { id_muestra, id_analisis, estado_resultado } = req.query;
    let filter = {};
    
    if (id_muestra) filter.id_muestra = id_muestra;
    if (id_analisis) filter.id_analisis = id_analisis;
    if (estado_resultado) filter.estado_resultado = estado_resultado;
    
    const resultados = await ResultadosMuestras.find(filter).select('-__v');
    
    res.json({
      success: true,
      count: resultados.length,
      data: resultados
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener resultados',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/resultados/{id}:
 *   get:
 *     summary: Obtener un resultado por ID
 *     tags: [Resultados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultado encontrado
 *       404:
 *         description: Resultado no encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const resultado = await ResultadosMuestras.findById(req.params.id).select('-__v');
    
    if (!resultado) {
      return res.status(404).json({
        success: false,
        error: 'Resultado no encontrado'
      });
    }

    res.json({
      success: true,
      data: resultado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el resultado',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/resultados:
 *   post:
 *     summary: Crear un nuevo resultado
 *     tags: [Resultados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResultadosMuestras'
 *     responses:
 *       201:
 *         description: Resultado creado exitosamente
 */
router.post('/', async (req, res) => {
  try {
    const resultado = new ResultadosMuestras(req.body);
    const savedResultado = await resultado.save();
    
    res.status(201).json({
      success: true,
      message: 'Resultado creado exitosamente',
      data: savedResultado
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
      error: 'Error al crear el resultado',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/resultados/{id}:
 *   put:
 *     summary: Actualizar un resultado
 *     tags: [Resultados]
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
 *             $ref: '#/components/schemas/ResultadosMuestras'
 *     responses:
 *       200:
 *         description: Resultado actualizado exitosamente
 */
router.put('/:id', async (req, res) => {
  try {
    const resultado = await ResultadosMuestras.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!resultado) {
      return res.status(404).json({
        success: false,
        error: 'Resultado no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Resultado actualizado exitosamente',
      data: resultado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el resultado',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/resultados/{id}:
 *   delete:
 *     summary: Eliminar un resultado
 *     tags: [Resultados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultado eliminado exitosamente
 */
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await ResultadosMuestras.findByIdAndDelete(req.params.id);

    if (!resultado) {
      return res.status(404).json({
        success: false,
        error: 'Resultado no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Resultado eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el resultado',
      details: error.message
    });
  }
});

module.exports = router;
