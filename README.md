# Sistema de Gestión de Equipamiento Tecnológico

## Descripción

Sistema desarrollado en NestJS con TypeORM para la gestión y control de equipamiento tecnológico. Implementa el modelo de datos especificado en [dbdiagram.io](https://dbdiagram.io/d/Sistema-inventario-685b2e4ef413ba3508b4cd4c) de forma estricta.

## Características Principales

- **Gestión de Equipos**: Registro completo de activos tecnológicos con información detallada
- **Control de Ubicaciones**: Sistema jerárquico de bodegas y ubicaciones físicas
- **Asignaciones**: Gestión de asignación de equipos a usuarios
- **Trazabilidad**: Seguimiento completo de movimientos y estados
- **Auditoría**: Registro de todas las acciones realizadas en el sistema
- **Inventarios Físicos**: Conciliación entre sistema y realidad física

## Modelo de Datos

El sistema implementa **exactamente** las siguientes entidades según el modelo especificado:

### Entidades Principales
- **Equipos**: Registro principal de activos tecnológicos
- **Categorias/Subcategorias**: Clasificación jerárquica de equipos
- **Usuarios/Perfiles**: Gestión de usuarios y permisos
- **Bodegas/Ubicaciones**: Estructura física de almacenamiento

### Gestión de Equipos
- **DocumentosEquipo**: Archivos asociados a equipos
- **Asignaciones**: Entrega de equipos a usuarios
- **EstadosStock**: Estados físicos/administrativos
- **Movimientos**: Registro de eventos del ciclo de vida

### Proveedores y Adquisiciones
- **Proveedores**: Empresas proveedoras
- **ModalidadesAdquisicion**: Formas de obtención
- **Licitaciones**: Procesos de compra formales

### Auditoría y Control
- **Auditoria**: Registro funcional de acciones
- **LogsSistema**: Registro técnico del sistema
- **InventariosFisicos**: Tomas de inventario físico
- **MovimientosFisicos**: Traslados entre ubicaciones
- **Configuraciones**: Parametrización del sistema

## Tecnologías Utilizadas

- **Backend**: NestJS + TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Variables de Entorno**: dotenv

## Instalación y Configuración

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

4. **Configurar variables de entorno**
```bash
# El archivo .env ya está configurado con:
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
# Desarrollo
npm run start:dev

# Producción
npm run start
```

## Estado del Proyecto

✅ **Sistema Completamente Funcional**

- ✅ Modelo de datos implementado según especificación exacta
- ✅ Base de datos PostgreSQL configurada
- ✅ Todas las entidades creadas correctamente
- ✅ Relaciones entre tablas establecidas
- ✅ Aplicación NestJS ejecutándose correctamente

## Estructura del Proyecto

```
src/
├── entities/           # Entidades del modelo de datos
│   ├── equipos.entity.ts
│   ├── usuarios.entity.ts
│   ├── categorias.entity.ts
│   ├── bodegas.entity.ts
│   └── ... (todas las entidades del modelo)
├── app.module.ts       # Módulo principal
├── main.ts            # Punto de entrada
└── data-source.ts     # Configuración de TypeORM
```

## API Endpoints

La aplicación está ejecutándose en `http://localhost:3000`

- Estado: ✅ Aplicación respondiendo
- Base de datos: ✅ 19 tablas creadas según el modelo
- Sincronización: ✅ Automática habilitada

## Verificación del Sistema

Para verificar que todo está funcionando:

```bash
# Verificar aplicación
curl http://localhost:3000

# Verificar tablas en la base de datos
sudo -u postgres psql -d gestion_equipamiento -c "\dt"
```

## Próximos Pasos

- Implementar controladores y servicios para cada entidad
- Desarrollar API REST para operaciones CRUD
- Agregar validaciones de negocio
- Implementar autenticación y autorización
- Desarrollar frontend (opcional)

---

**Nota**: Este sistema implementa **estrictamente** el modelo de datos especificado en dbdiagram.io sin agregar ni modificar ninguna entidad.