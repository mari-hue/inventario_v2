# Estructura Modular - Sistema de Gestión de Equipamiento

## Organización de Módulos

La aplicación está organizada siguiendo patrones profesionales de NestJS con una arquitectura modular clara y escalable.

### 📁 Estructura de Directorios

```
src/
├── modules/                    # Módulos de negocio organizados por dominio
│   ├── equipos/               # Gestión principal de equipos
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── equipos.controller.ts
│   │   ├── equipos.service.ts
│   │   └── equipos.module.ts
│   ├── usuarios/              # Gestión de usuarios
│   ├── asignaciones/          # Asignación de equipos
│   ├── categorias/            # Clasificación de equipos
│   ├── bodegas/               # Gestión de bodegas y ubicaciones
│   └── shared/                # Servicios compartidos
│       └── services/          # Servicios transversales
├── entities/                  # Entidades de TypeORM
└── app.module.ts             # Módulo principal
```

## 🔧 Módulos Implementados

### **EquiposModule**
- **Responsabilidad**: Gestión principal de activos tecnológicos
- **Entidades**: Equipos, Categorias, Subcategorias, ModalidadesAdquisicion, Proveedores, Licitaciones, Ubicaciones
- **Endpoints**: CRUD completo + filtros por estado y categoría
- **Servicios**: EquiposService con relaciones cargadas

### **UsuariosModule**
- **Responsabilidad**: Gestión de usuarios del sistema
- **Entidades**: Usuarios, Perfiles
- **Endpoints**: CRUD + búsqueda por perfil y email
- **Servicios**: UsuariosService con validaciones

### **AsignacionesModule**
- **Responsabilidad**: Asignación de equipos a usuarios
- **Entidades**: Asignaciones, Equipos, Usuarios
- **Funcionalidad**: Seguimiento de entregas y devoluciones

### **CategoriasModule**
- **Responsabilidad**: Gestión de clasificación jerárquica
- **Entidades**: Categorias, Subcategorias
- **Funcionalidad**: Organización taxonómica de equipos

### **BodegasModule**
- **Responsabilidad**: Gestión de almacenes y ubicaciones físicas
- **Entidades**: Bodegas, Ubicaciones, Usuarios
- **Controladores**: BodegasController, UbicacionesController
- **Funcionalidad**: Estructura jerárquica de ubicaciones

### **SharedModule**
- **Responsabilidad**: Servicios compartidos y transversales
- **Entidades**: Configuraciones, Auditoria, LogsSistema, Perfiles
- **Servicios**:
  - `ConfiguracionesService`: Parametrización del sistema
  - `AuditoriaService`: Registro funcional de acciones
  - `LogsSistemaService`: Logging técnico
  - `PerfilesService`: Gestión de roles

## 🚀 Patrones Implementados

### **1. Domain-Driven Design (DDD)**
- Módulos organizados por dominio de negocio
- Separación clara de responsabilidades
- Servicios especializados por entidad

### **2. Dependency Injection**
- Inyección de dependencias con TypeORM
- Servicios exportados para reutilización
- Módulos desacoplados

### **3. Data Transfer Objects (DTOs)**
- Validación con class-validator
- Separación de CreateDto y UpdateDto
- Uso de PartialType para reutilización

### **4. Repository Pattern**
- Acceso a datos a través de repositorios TypeORM
- Operaciones CRUD estandarizadas
- Manejo de relaciones optimizado

### **5. Controller Pattern**
- Endpoints RESTful estándar
- Manejo de parámetros y query strings
- Validación automática con pipes

## 📊 Flujos de Datos

### **Flujo Principal - Gestión de Equipos**
```
EquiposController → EquiposService → Repository → Database
                 ↗                 ↗
SharedModule (Audit)    CategoriasModule (Classification)
```

### **Flujo de Auditoría**
```
Any Controller → AuditoriaService → Database
                ↗
Usuario Context (from JWT/Session)
```

## 🔐 Servicios Transversales

### **AuditoriaService**
- Registro automático de acciones CRUD
- Trazabilidad completa por usuario
- Consultas por entidad o usuario

### **ConfiguracionesService**
- Gestión de parámetros del sistema
- Configuración dinámica
- Cache de configuraciones frecuentes

### **LogsSistemaService**
- Logging técnico de la aplicación
- Registro de accesos e IP
- Monitoreo de actividad del sistema

## 🎯 Ventajas de la Estructura

1. **Escalabilidad**: Fácil agregar nuevos módulos
2. **Mantenibilidad**: Código organizado por dominio
3. **Testabilidad**: Módulos independientes y testeables
4. **Reutilización**: Servicios compartidos exportados
5. **Separación de Responsabilidades**: Cada módulo tiene un propósito claro
6. **Estándares NestJS**: Siguiendo mejores prácticas del framework

## 📝 Próximos Pasos

- [ ] Implementar controladores faltantes (Proveedores, Licitaciones)
- [ ] Agregar interceptors para auditoría automática
- [ ] Implementar guards para autorización por perfil
- [ ] Agregar tests unitarios para cada servicio
- [ ] Documentación OpenAPI/Swagger
- [ ] Middleware de logging automático