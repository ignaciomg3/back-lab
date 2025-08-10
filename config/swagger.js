const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Backend Laboratorio',
      version: '1.0.0',
      description: 'API RESTful para gestión de datos de laboratorio con MongoDB',
      contact: {
        name: 'Soporte API',
        email: 'soporte@laboratorio.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.laboratorio.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acceso faltante o inválido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    example: 'Token no válido'
                  }
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    example: 'Recurso no encontrado'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    example: 'Errores de validación'
                  },
                  details: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['El nombre es obligatorio', 'El email debe ser válido']
                  }
                }
              }
            }
          }
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    example: 'Error interno del servidor'
                  },
                  details: {
                    type: 'string',
                    example: 'Descripción del error específico'
                  }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Usuarios',
        description: 'Operaciones relacionadas con usuarios'
      },
      {
        name: 'Análisis',
        description: 'Gestión de análisis de laboratorio'
      },
      {
        name: 'Resultados',
        description: 'Resultados de análisis de muestras'
      },
      {
        name: 'Muestras 1997',
        description: 'Muestras de la campaña de 1997'
      },
      {
        name: 'Muestras 1999',
        description: 'Muestras de la campaña de 1999'
      }
    ]
  },
  apis: [
    './routes/*.js', // Rutas donde están los comentarios de Swagger
    './models/*.js'  // Modelos donde pueden estar esquemas adicionales
  ],
};

const specs = swaggerJsdoc(options);

// Configuración personalizada de Swagger UI
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    filter: true,
    tryItOutEnabled: true,
    requestInterceptor: (req) => {
      req.headers['Accept'] = 'application/json';
      req.headers['Content-Type'] = 'application/json';
      return req;
    }
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #1f2937; }
    .swagger-ui .scheme-container { 
      background: #f8f9fa; 
      border: 1px solid #e9ecef; 
      border-radius: 4px; 
      padding: 10px; 
      margin-bottom: 20px; 
    }
  `,
  customSiteTitle: "API Laboratorio - Documentación",
  customfavIcon: "/favicon.ico"
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};
