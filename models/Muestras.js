const mongoose = require('mongoose');

// Schema base para Muestras (común para 1997 y 1999)
const muestraBaseSchema = {
  numero_muestra: {
    type: String,
    required: true,
    unique: true
  },
  fecha_toma: {
    type: Date,
    required: true
  },
  origen: {
    type: String,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  tipo_muestra: {
    type: String,
    required: true,
    enum: ['agua', 'suelo', 'aire', 'alimento', 'otro']
  },
  estado_muestra: {
    type: String,
    enum: ['recibida', 'en_proceso', 'analizada', 'archivada'],
    default: 'recibida'
  },
  temperatura_conservacion: {
    type: Number
  },
  ph: {
    type: Number
  },
  responsable_toma: {
    type: String,
    required: true
  },
  observaciones: {
    type: String,
    default: ''
  },
  año_campana: {
    type: Number,
    required: true
  }
};

// Schema para Muestras 1997
const muestras1997Schema = new mongoose.Schema({
  ...muestraBaseSchema,
  condiciones_especiales_1997: {
    type: String
  }
});

// Schema para Muestras 1999
const muestras1999Schema = new mongoose.Schema({
  ...muestraBaseSchema,
  metodologia_nueva: {
    type: String
  },
  equipos_utilizados: [{
    nombre_equipo: String,
    modelo: String,
    calibracion: Date
  }]
});

const Muestras1997 = mongoose.model('Muestras1997', muestras1997Schema, 'muestras_1997');
const Muestras1999 = mongoose.model('Muestras1999', muestras1999Schema, 'muestras_1999');

module.exports = {
  Muestras1997,
  Muestras1999
};
