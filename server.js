const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Importar configuración de Swagger
const { specs, swaggerUi, swaggerOptions } = require('./config/swagger');

// Importar rutas
const userRoutes = require('./routes/users');
const analisisRoutes = require('./routes/analisis');
const resultadosRoutes = require('./routes/resultados');
const muestrasRoutes = require('./routes/muestras');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet()); // Seguridad
app.use(cors()); // Permitir conexiones cross-origin
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado exitosamente a MongoDB');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Servidor backend funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: 'http://localhost:3000/api-docs',
    collections: [
      'users',
      'analisis', 
      'resultados_muestras',
      'muestras_1997',
      'muestras_1999'
    ]
  });
});

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Rutas de la API
app.use('/api', authRoutes); // Login
app.use('/api/users', userRoutes);
app.use('/api/analisis', analisisRoutes);
app.use('/api/resultados', resultadosRoutes);
app.use('/api/muestras', muestrasRoutes);

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor`
  });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV}`);
});

module.exports = app;
