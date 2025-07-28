# Sistema de Gestión de Equipamiento Tecnológico

## Descripción

Sistema desarrollado en NestJS con TypeORM para la gestión y control de equipamiento tecnológico. Implementa **estrictamente** el modelo de datos especificado en [dbdiagram.io](https://dbdiagram.io/d/Sistema-inventario-685b2e4ef413ba3508b4cd4c) con una **arquitectura modular profesional**.

## 🏗️ Arquitectura Modular Profesional

### Estructura Organizada por Dominio
```
src/
├── modules/                    # Módulos de negocio (Domain-Driven Design)
│   ├── equipos/               # 🖥️ Gestión principal de equipos
│   │   ├── dto/               # Data Transfer Objects con validación
│   │   ├── equipos.controller.ts
│   │   ├── equipos.service.ts
│   │   └── equipos.module.ts
│   ├── usuarios/              # 👥 Gestión de usuarios y perfiles
│   ├── asignaciones/          # 📋 Asignación y devolución de equipos
│   ├── categorias/            # 📂 Clasificación jerárquica
│   ├── bodegas/               # 🏭 Gestión de almacenes y ubicaciones
│   └── shared/                # 🔧 Servicios transversales
│       └── services/          # Auditoría, configuración, logs
├── entities/                  # 🗄️ Entidades TypeORM organizadas
└── app.module.ts             # 🚀 Módulo principal
```

### Patrones Implementados
- ✅ **Domain-Driven Design (DDD)**: Módulos por dominio de negocio
- ✅ **Dependency Injection**: Servicios desacoplados y reutilizables
- ✅ **Repository Pattern**: Acceso a datos optimizado
- ✅ **DTO Pattern**: Validación con class-validator
- ✅ **Controller Pattern**: Endpoints RESTful estándar

## 🔧 Módulos Implementados

### **EquiposModule** 🖥️
- **Endpoints**: `/equipos` - CRUD completo + filtros
- **Funciones**: Gestión de activos tecnológicos con relaciones
- **Filtros**: Por estado, categoría, proveedor

### **UsuariosModule** 👥
- **Endpoints**: `/usuarios` - Gestión de usuarios
- **Funciones**: CRUD + búsqueda por perfil y email
- **Relaciones**: Con perfiles y asignaciones

### **AsignacionesModule** 📋
- **Endpoints**: `/asignaciones` - Asignación de equipos
- **Funciones**: Entrega, devolución, seguimiento
- **Filtros**: Por usuario, equipo, fecha

### **CategoriasModule** 📂
- **Endpoints**: `/categorias` - Clasificación jerárquica
- **Funciones**: Organización taxonómica de equipos

### **BodegasModule** 🏭
- **Endpoints**: `/bodegas`, `/ubicaciones`
- **Funciones**: Gestión de almacenes y ubicaciones físicas
- **Características**: Estructura jerárquica de ubicaciones

### **SharedModule** 🔧
- **Servicios Transversales**:
  - `ConfiguracionesService`: Parametrización del sistema
  - `AuditoriaService`: Registro funcional de acciones
  - `LogsSistemaService`: Logging técnico de la plataforma
  - `PerfilesService`: Gestión de roles y permisos

## 📊 API Endpoints Disponibles

### Equipos
```http
GET    /equipos              # Listar equipos
GET    /equipos?estado=xxx   # Filtrar por estado
GET    /equipos?categoria=1  # Filtrar por categoría
GET    /equipos/:id          # Obtener equipo específico
POST   /equipos              # Crear nuevo equipo
PATCH  /equipos/:id          # Actualizar equipo
DELETE /equipos/:id          # Eliminar equipo
```

### Usuarios
```http
GET    /usuarios             # Listar usuarios
GET    /usuarios?perfil=1    # Filtrar por perfil
GET    /usuarios?email=xxx   # Buscar por email
POST   /usuarios             # Crear usuario
PATCH  /usuarios/:id         # Actualizar usuario
DELETE /usuarios/:id         # Eliminar usuario
```

### Asignaciones
```http
GET    /asignaciones         # Listar asignaciones
GET    /asignaciones?usuario=1  # Por usuario
GET    /asignaciones?equipo=1   # Por equipo
POST   /asignaciones         # Nueva asignación
PATCH  /asignaciones/:id     # Actualizar asignación
DELETE /asignaciones/:id     # Eliminar asignación
```

### Bodegas y Ubicaciones
```http
GET    /bodegas              # Listar bodegas
GET    /ubicaciones          # Listar ubicaciones
GET    /ubicaciones?bodega=1 # Ubicaciones de una bodega
POST   /bodegas              # Crear bodega
POST   /ubicaciones          # Crear ubicación
```

### Categorías
```http
GET    /categorias           # Listar categorías
POST   /categorias           # Crear categoría
PATCH  /categorias/:id       # Actualizar categoría
DELETE /categorias/:id       # Eliminar categoría
```

## 🗄️ Modelo de Datos (19 Entidades)

### Entidades Principales
- **Equipos**: Registro principal de activos tecnológicos
- **Categorias/Subcategorias**: Clasificación jerárquica
- **Usuarios/Perfiles**: Gestión de usuarios y permisos
- **Bodegas/Ubicaciones**: Estructura física de almacenamiento

### Gestión Operativa
- **Asignaciones**: Entrega de equipos a usuarios
- **EstadosStock**: Estados físicos/administrativos
- **Movimientos**: Registro de eventos del ciclo de vida
- **MovimientosFisicos**: Traslados entre ubicaciones

### Proveedores y Adquisiciones
- **Proveedores**: Empresas proveedoras
- **ModalidadesAdquisicion**: Formas de obtención
- **Licitaciones**: Procesos de compra formales

### Auditoría y Control
- **Auditoria**: Registro funcional de acciones de negocio
- **LogsSistema**: Registro técnico de la plataforma
- **InventariosFisicos**: Tomas de inventario físico
- **DocumentosEquipo**: Archivos asociados a equipos
- **Configuraciones**: Parametrización del sistema

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- PostgreSQL
- npm

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd inventario_v2
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
```bash
# Crear la base de datos
sudo -u postgres createdb gestion_equipamiento
```

4. **Variables de entorno** (`.env` preconfigurado)
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=gestion_equipamiento
DB_SYNCHRONIZE=true
```

5. **Ejecutar la aplicación**
```bash
# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run start
```

## ✅ Estado del Proyecto

### **Sistema Completamente Funcional y Modularizado**

- ✅ **Arquitectura**: Modular profesional con Domain-Driven Design
- ✅ **Modelo de Datos**: 19 entidades implementadas según especificación exacta
- ✅ **Base de Datos**: PostgreSQL configurada y sincronizada
- ✅ **API REST**: Endpoints CRUD para todas las entidades principales
- ✅ **Validación**: DTOs con class-validator implementados
- ✅ **Relaciones**: Asociaciones entre entidades cargadas correctamente
- ✅ **Servicios Transversales**: Auditoría, logging y configuración
- ✅ **Separación de Responsabilidades**: Cada módulo con propósito específico

### **Verificación del Sistema**

```bash
# Verificar aplicación
curl http://localhost:3000/equipos

# Verificar base de datos
sudo -u postgres psql -d gestion_equipamiento -c "\dt"
```

## 🎯 Ventajas de la Arquitectura Modular

1. **Escalabilidad**: Fácil agregar nuevos módulos sin afectar existentes
2. **Mantenibilidad**: Código organizado por dominio de negocio
3. **Testabilidad**: Módulos independientes y fáciles de testear
4. **Reutilización**: Servicios compartidos exportados entre módulos
5. **Estándares**: Siguiendo mejores prácticas de NestJS y DDD
6. **Separación de Responsabilidades**: Cada módulo tiene un propósito claro

## 📚 Documentación Técnica

- [Estructura Modular Detallada](src/modules/README.md)
- [Índice de Entidades](src/entities/index.ts)

## 🔄 Próximos Pasos

- [ ] Implementar interceptors para auditoría automática
- [ ] Agregar guards para autorización por perfil
- [ ] Documentación OpenAPI/Swagger
- [ ] Tests unitarios para cada servicio
- [ ] Middleware de logging automático
- [ ] Validaciones de negocio específicas

---

**Nota**: Este sistema implementa **estrictamente** el modelo de datos especificado en dbdiagram.io con una arquitectura modular profesional que sigue las mejores prácticas de NestJS y Domain-Driven Design.