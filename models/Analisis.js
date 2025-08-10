const mongoose = require('mongoose');

// Schema para Análisis - basado en la estructura real de la BD
const analisisSchema = new mongoose.Schema({
  nro_informe: {
    type: Number,
    required: true,
    unique: true
  },
  solicitante: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  responsable: {
    type: String,
    default: null
  },
  estado: {
    type: String,
    required: true
  },
  tipo_analisis: {
    type: String,
    required: true
  }
}, {
  timestamps: false, // No usar timestamps automáticos
  versionKey: false  // No usar __v
});

// Método para obtener información básica del análisis
analisisSchema.methods.getPublicProfile = function() {
  return {
    nro_informe: this.nro_informe,
    solicitante: this.solicitante,
    fecha: this.fecha,
    responsable: this.responsable,
    estado: this.estado,
    tipo_analisis: this.tipo_analisis
  };
};

module.exports = mongoose.model('Analisis', analisisSchema, 'analisis');
