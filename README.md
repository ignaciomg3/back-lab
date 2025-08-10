# Backend MongoDB con Node.js y Express

Este es un backend completo desarrollado con Node.js, Express y MongoDB que proporciona una API RESTful para gestionar usuarios.

## 🚀 Características

- **Express.js** - Framework web rápido y minimalista
- **MongoDB** - Base de datos NoSQL con Mongoose ODM
- **CORS** - Configurado para permitir conexiones cross-origin
- **Helmet** - Middleware de seguridad
- **Morgan** - Logger de requests HTTP
- **Validación** - Validación de datos con Mongoose
- **Manejo de errores** - Sistema robusto de manejo de errores

## 📋 Prerrequisitos

Antes de ejecutar este proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [MongoDB](https://www.mongodb.com/try/download/community) ejecutándose localmente en el puerto 27017
- [Git](https://git-scm.com/)

## 🛠️ Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Revisa el archivo `.env` y ajusta las configuraciones según tu entorno
   - Por defecto se conecta a `mongodb://localhost:27017/back-lab`

3. **Asegúrate de que MongoDB esté ejecutándose:**
   ```bash
   # En Windows, si MongoDB está instalado como servicio:
   net start MongoDB
   
   # O ejecuta mongod manualmente:
   mongod
   ```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```
Esto iniciará el servidor con nodemon para recarga automática en `http://localhost:3000`

### Producción
```bash
npm start
```

## 📚 API Endpoints

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Obtener todos los usuarios activos |
| GET | `/api/users/:id` | Obtener un usuario por ID |
| POST | `/api/users` | Crear un nuevo usuario |
| PUT | `/api/users/:id` | Actualizar un usuario |
| DELETE | `/api/users/:id` | Eliminar un usuario (soft delete) |

### Ejemplos de uso

**Crear un usuario:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "age": 30
  }'
```

**Obtener todos los usuarios:**
```bash
curl http://localhost:3000/api/users
```

## 📁 Estructura del proyecto

```
back-lab/
├── models/
│   └── User.js          # Modelo de usuario con Mongoose
├── routes/
│   └── users.js         # Rutas de la API para usuarios
├── .env                 # Variables de entorno
├── .gitignore          # Archivos ignorados por Git
├── package.json        # Dependencias y scripts
├── server.js           # Archivo principal del servidor
└── README.md           # Este archivo
```

## 🔧 Configuración

### Variables de entorno (.env)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/back-lab
NODE_ENV=development
JWT_SECRET=tu_clave_secreta_super_segura_aqui
```

### Modelo de Usuario

El modelo de usuario incluye las siguientes propiedades:

- `name` (String, requerido): Nombre del usuario
- `email` (String, requerido, único): Email del usuario
- `age` (Number, opcional): Edad del usuario
- `isActive` (Boolean, default: true): Estado del usuario
- `createdAt` (Date): Fecha de creación
- `updatedAt` (Date): Fecha de última actualización

## 🛡️ Seguridad

- **Helmet**: Protege la aplicación configurando varios headers HTTP
- **CORS**: Configurado para permitir conexiones cross-origin
- **Validación**: Validación de datos tanto en el modelo como en las rutas
- **Soft Delete**: Los usuarios no se eliminan físicamente, solo se marcan como inactivos

## 🐛 Manejo de errores

El sistema incluye manejo robusto de errores:

- Errores de validación de Mongoose
- Errores de duplicación (email único)
- Errores 404 para recursos no encontrados
- Errores 500 para errores internos del servidor

## 📝 Logging

Se utiliza Morgan para el logging de requests HTTP en formato combinado, que incluye:
- IP del cliente
- Timestamp
- Método HTTP y URL
- Código de estado
- Tamaño de respuesta
- User agent

## 🚀 Próximos pasos recomendados

1. **Autenticación**: Implementar JWT para autenticación de usuarios
2. **Más modelos**: Agregar modelos para productos, órdenes, etc.
3. **Testing**: Implementar tests unitarios e integración
4. **Documentación**: Agregar Swagger/OpenAPI para documentación automática
5. **Rate limiting**: Implementar límites de requests
6. **Caching**: Agregar Redis para caching

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -am 'Agregar nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
