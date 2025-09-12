# The Clock - Documentación del Backend

## 📋 Descripción General

El backend de **The Clock** es una API REST construida con Node.js, Express y TypeScript que proporciona servicios de autenticación y gestión de datos para la aplicación de productividad. Utiliza MySQL como base de datos e implementa un sistema de autenticación JWT seguro.

## 🏗️ Arquitectura del Proyecto

```
server/
├── src/
│   ├── controllers/     # Lógica de negocio
│   ├── db/
│   │   └── connection.ts  # Configuración de base de datos
│   ├── middleware/
│   │   └── auth.ts     # Middleware de autenticación
│   ├── migrations/
│   │   └── run-migrations.ts  # Ejecutor de migraciones
│   ├── models/         # Modelos de datos
│   ├── routes/
│   │   ├── auth.ts     # Rutas de autenticación
│   │   ├── items.ts    # Rutas CRUD para items
│   │   ├── notes.ts    # Rutas específicas para notas
│   │   └── tasks.ts    # Rutas específicas para tareas
│   ├── types/
│   │   └── index.ts    # Definiciones de tipos TypeScript
│   ├── utils/          # Utilidades
│   ├── database.ts     # Configuración de conexión a BD
│   └── index.ts        # Punto de entrada de la aplicación
├── migrations/
│   ├── 001_init.sql    # Script de inicialización de BD
│   └── run_migrations.sh  # Script de ejecución de migraciones
├── scripts/
└── dist/               # Código compilado (JavaScript)
```

## 🗄️ Estructura de la Base de Datos

### Tabla `users`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | Identificador único del usuario |
| username | VARCHAR(255) NOT NULL UNIQUE | Nombre de usuario único |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

### Tabla `items`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | Identificador único del item |
| user_id | INT NOT NULL | ID del usuario propietario |
| kind | ENUM('note','task','todo') NOT NULL | Tipo de item |
| data | JSON NOT NULL | Datos del item en formato JSON |
| updated_at | DATETIME NOT NULL | Última actualización |
| deleted | TINYINT(1) DEFAULT 0 | Borrado lógico (0=activo, 1=borrado) |

**Índices:**
- `idx_user_updated`: Para búsquedas por usuario y fecha
- `idx_user_deleted`: Para filtrar items borrados

## 🔌 API Endpoints

### Autenticación (`/auth`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/register` | Registro de nuevo usuario |
| POST | `/login` | Inicio de sesión |

### Items (`/api/items`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todos los items del usuario |
| POST | `/` | Crear nuevo item |
| PUT | `/:id` | Actualizar item existente |
| DELETE | `/:id` | Borrado lógico de item |
| GET | `/sync/changes` | Sincronizar cambios desde fecha específica |

### Salud del Sistema
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Verificar estado del servidor |

## 🔐 Sistema de Autenticación

### Flujo de Autenticación JWT
1. **Registro**: El usuario crea una cuenta con nombre de usuario único
2. **Login**: Se verifican credenciales y se genera un token JWT
3. **Middleware**: Todas las rutas protegidas verifican el token
4. **Autorización**: Cada usuario solo accede a sus propios datos

### Middleware de Autenticación
```typescript
// Verifica el token JWT en cada petición
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // Verificación y decodificación del token
  // Si es válido, agrega user_id al request
  // Si no es válido, retorna error 401
};
```

## 🛠️ Configuración del Proyecto

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
DB_HOST=192.168.0.110
DB_USER=theclock
DB_PASSWORD=J15m06..!
DB_NAME=the_clock
JWT_SECRET=tu_clave_secreta_jwt
PORT=3002
```

### Instalación y Ejecución

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Compilar TypeScript**
   ```bash
   npm run build
   ```

3. **Ejecutar migraciones de base de datos**
   ```bash
   npm run migrate
   ```

4. **Iniciar servidor en desarrollo**
   ```bash
   npm run dev
   ```

5. **Iniciar servidor en producción**
   ```bash
   npm start
   ```

## 📊 Modelo de Datos

### Estructura de Items
Cada item tiene una estructura flexible almacenada en JSON:

**Nota (note):**
```json
{
  "title": "Título de la nota",
  "content": "Contenido de la nota...",
  "createdAt": "2023-12-01T10:30:00Z",
  "updatedAt": "2023-12-01T11:45:00Z"
}
```

**Tarea (task/todo):**
```json
{
  "text": "Descripción de la tarea",
  "completed": false,
  "createdAt": "2023-12-01T10:30:00Z",
  "updatedAt": "2023-12-01T11:45:00Z"
}
```

## 🔄 Sincronización

El sistema implementa sincronización eficiente mediante:

1. **Timestamp-based sync**: Los clientes pueden solicitar cambios desde una fecha específica
2. **Soft delete**: Los items no se eliminan físicamente, se marcan como borrados
3. **Conflict resolution**: Última modificación prevalece

Ejemplo de sincronización:
```http
GET /api/items/sync/changes?since=2023-12-01T10:30:00Z
```

## 🚀 Características Técnicas

### Rendimiento
- **Connection pooling**: Reutilización de conexiones a la base de datos
- **Indexación optimizada**: Búsquedas rápidas por usuario y fecha
- **Compresión**: Respuestas JSON comprimidas

### Seguridad
- **Validación de datos**: Sanitización de entradas
- **Protección CORS**: Configuración específica de dominios
- **Tokens JWT**: Autenticación stateless segura
- **Hash de contraseñas**: Almacenamiento seguro de credenciales

### Escalabilidad
- **Arquitectura modular**: Fácil expansión de funcionalidades
- **Manejo de errores**: Sistema robusto de captura de excepciones
- **Logs estructurados**: Facilitan monitoreo y debugging

## 📝 Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:3002/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "nuevo_usuario"}'
```

### Creación de Item
```bash
curl -X POST http://localhost:3002/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "kind": "note",
    "data": {
      "title": "Mi primera nota",
      "content": "Contenido de ejemplo"
    }
  }'
```

### Sincronización de Cambios
```bash
curl -X GET \
  "http://localhost:3002/api/items/sync/changes?since=2023-12-01T10:30:00Z" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## 🐛 Solución de Problemas

### Errores Comunes
1. **Error de conexión a BD**: Verificar credenciales en `.env`
2. **Puerto en uso**: Cambiar variable `PORT` en `.env`
3. **Error de migración**: Ejecutar manualmente el script SQL

### Logs y Monitoreo
Revisar logs de consola para:
- Errores de conexión a base de datos
- Intentos de autenticación fallidos
- Errores de validación de datos

## 🔮 Próximas Mejoras

- [ ] Cache Redis para mejorar rendimiento
- [ ] Sistema de notificaciones push
- [ ] Backup automático de base de datos
- [ ] API documentation con Swagger
- [ ] Rate limiting para prevenir abusos
- [ ] Metrics y monitoring con Prometheus

---

Este backend proporciona una base sólida y escalable para la aplicación The Clock, con énfasis en seguridad, rendimiento y mantenibilidad. La arquitectura modular permite fácil expansión para nuevas funcionalidades.