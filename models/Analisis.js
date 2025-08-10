const mongoose = require('mongoose');

// Schema para Análisis
const analisisSchema = new mongoose.Schema({
  numero_analisis: {
    type: String,
    required: true,
    unique: true
  },
  fecha_analisis: {
    type: Date,
    default: Date.now
  },
  tipo_analisis: {
    type: String,
    required: true
  },
  laboratorio: {
    type: String,
    required: true
  },
  tecnico_responsable: {
    type: String,
    required: true
  },
  observaciones: {
    type: String,
    default: ''
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

analisisSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Analisis', analisisSchema, 'analisis');
