const mongoose = require('mongoose');

// Schema para Resultados de Muestras
const resultadosMuestrasSchema = new mongoose.Schema({
  id_muestra: {
    type: String,
    required: true,
    ref: 'Muestra'
  },
  id_analisis: {
    type: String,
    required: true,
    ref: 'Analisis'
  },
  parametro: {
    type: String,
    required: true
  },
  valor: {
    type: mongoose.Schema.Types.Mixed, // Puede ser número, string, etc.
    required: true
  },
  unidad: {
    type: String,
    required: true
  },
  limite_inferior: {
    type: Number
  },
  limite_superior: {
    type: Number
  },
  estado_resultado: {
    type: String,
    enum: ['normal', 'fuera_rango', 'critico'],
    default: 'normal'
  },
  fecha_resultado: {
    type: Date,
    default: Date.now
  },
  metodo_analisis: {
    type: String
  },
  observaciones: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('ResultadosMuestras', resultadosMuestrasSchema, 'resultados_muestras');
