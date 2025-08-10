const mongoose = require('mongoose');

// Schema para usuarios - basado en la estructura real de la BD
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nombre de usuario no puede tener más de 50 caracteres']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  role: {
    type: String,
    required: [true, 'El rol es obligatorio'],
    enum: ['admin', 'usuario', 'tecnico', 'supervisor'],
    default: 'usuario'
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: false, // No usar timestamps automáticos
  versionKey: false  // No usar __v
});

// Método para obtener información básica del usuario
userSchema.methods.getPublicProfile = function() {
  return {
    username: this.username,
    role: this.role,
    email: this.email,
    activo: this.activo
    // No incluimos password por seguridad
  };
};

module.exports = mongoose.model('User', userSchema, 'users');
