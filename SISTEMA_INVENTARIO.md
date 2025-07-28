# Sistema de Inventario - Documentación

## Descripción General

Este sistema de inventario ha sido diseñado para gestionar productos, bodegas, movimientos de stock, órdenes de compra y venta de manera integral. El sistema está basado en NestJS con TypeORM y PostgreSQL.

## Estructura del Sistema

### Entidades Principales

#### 1. Productos (`productos`)
- **Función**: Catálogo maestro de productos
- **Campos principales**:
  - `codigo_producto`: Código único interno (SKU)
  - `codigo_barras`: Código de barras universal (UPC)
  - `nombre`: Nombre del producto
  - `precio_costo`: Precio de costo
  - `precio_venta`: Precio de venta
  - `stock_minimo`: Stock mínimo permitido
  - `stock_maximo`: Stock máximo recomendado
  - `punto_reorden`: Punto de reorden automático

#### 2. Categorías (`categorias`)
- **Función**: Clasificación de productos
- **Relación**: Un producto pertenece a una categoría

#### 3. Proveedores (`proveedores`)
- **Función**: Gestión de proveedores
- **Campos principales**:
  - `nombre`: Nombre del proveedor
  - `rut`: RUT único
  - `contacto_principal`: Persona de contacto
  - `dias_plazo_entrega`: Días de plazo de entrega

#### 4. Bodegas (`bodegas`)
- **Función**: Almacenes físicos
- **Campos principales**:
  - `codigo_bodega`: Código único de bodega
  - `tipo_bodega`: Tipo (general, refrigerada, especial)
  - `capacidad_maxima`: Capacidad máxima

#### 5. Inventarios (`inventarios`)
- **Función**: Stock por producto por bodega
- **Campos principales**:
  - `cantidad_actual`: Cantidad física actual
  - `cantidad_reservada`: Cantidad reservada
  - `cantidad_disponible`: Cantidad disponible para venta
  - `costo_promedio`: Costo promedio ponderado

#### 6. Movimientos de Inventario (`movimientos_inventario`)
- **Función**: Historial completo de movimientos
- **Tipos de movimiento**:
  - `entrada`: Ingreso de mercadería
  - `salida`: Salida de mercadería
  - `transferencia`: Transferencia entre bodegas
  - `ajuste`: Ajuste manual de inventario

#### 7. Clientes (`clientes`)
- **Función**: Gestión de clientes
- **Tipos**: Natural, Jurídico

#### 8. Órdenes de Compra (`ordenes_compra`)
- **Función**: Órdenes a proveedores
- **Estados**: pendiente, enviada, parcialmente_recibida, recibida, cancelada

#### 9. Órdenes de Venta (`ordenes_venta`)
- **Función**: Órdenes de clientes
- **Estados**: pendiente, confirmada, procesando, despachada, entregada, cancelada

## API Endpoints

### Productos
```
GET    /productos              # Listar productos con paginación
POST   /productos              # Crear producto
GET    /productos/:id          # Obtener producto por ID
PATCH  /productos/:id          # Actualizar producto
DELETE /productos/:id          # Desactivar producto
GET    /productos/codigo/:codigo           # Buscar por código
GET    /productos/barras/:codigoBarras     # Buscar por código de barras
GET    /productos/bajo-stock              # Productos bajo stock
GET    /productos/estadisticas            # Estadísticas de productos
```

### Inventarios
```
GET    /inventarios/resumen                           # Resumen general
GET    /inventarios/bodega/:bodegaId                  # Inventario por bodega
GET    /inventarios/producto/:productoId              # Inventario por producto
GET    /inventarios/producto/:pid/bodega/:bid         # Inventario específico
POST   /inventarios/movimiento                        # Registrar movimiento
POST   /inventarios/ajuste                            # Ajustar inventario
POST   /inventarios/transferencia                     # Transferir entre bodegas
GET    /inventarios/movimientos                       # Historial de movimientos
```

## Tipos de Movimientos

### 1. Entrada
- **Uso**: Recepción de mercadería (compras, devoluciones)
- **Efecto**: Incrementa el stock
- **Campos requeridos**: `productoId`, `bodegaId`, `cantidad`, `costoUnitario`

### 2. Salida
- **Uso**: Despacho de mercadería (ventas, mermas)
- **Efecto**: Disminuye el stock
- **Validación**: Verifica stock disponible

### 3. Transferencia
- **Uso**: Mover productos entre bodegas
- **Efecto**: Disminuye en bodega origen, aumenta en bodega destino
- **Transaccional**: Ambos movimientos o ninguno

### 4. Ajuste
- **Uso**: Corrección manual de inventario
- **Efecto**: Establece cantidad exacta
- **Motivos comunes**: Inventario físico, corrección de errores

## Funcionalidades Clave

### 1. Control de Stock
- **Stock mínimo**: Alerta cuando stock está bajo
- **Punto de reorden**: Trigger para generar órdenes de compra
- **Stock máximo**: Control de sobrestock

### 2. Costo Promedio Ponderado
- Se actualiza automáticamente en cada entrada
- Formula: `(Stock_Anterior * Costo_Anterior + Cantidad_Nueva * Costo_Nuevo) / Stock_Total`

### 3. Trazabilidad
- Historial completo de movimientos
- Auditoría de cambios con usuario y fecha
- Referencia a documentos origen (órdenes)

### 4. Validaciones
- Stock suficiente para salidas y transferencias
- Productos y bodegas válidos
- Códigos únicos (producto, barras)

## Instalación y Configuración

### 1. Base de Datos
```bash
# Ejecutar script SQL
psql -U username -d database_name -f bd_postgresql/sistema_inventario.sql
```

### 2. Variables de Entorno
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=inventario_db
DB_SYNCHRONIZE=false
```

### 3. Instalar Dependencias
```bash
npm install class-validator class-transformer
```

## Ejemplos de Uso

### Crear un Producto
```json
POST /productos
{
  "codigoProducto": "LAPTOP-001",
  "nombre": "Laptop HP Pavilion",
  "descripcion": "Laptop HP Pavilion 15.6 Intel i5",
  "precioCosto": 450000,
  "precioVenta": 599000,
  "stockMinimo": 5,
  "stockMaximo": 20,
  "puntoReorden": 10,
  "categoriaId": 1,
  "proveedorPrincipalId": 1
}
```

### Registrar Entrada de Mercadería
```json
POST /inventarios/movimiento
{
  "productoId": 1,
  "bodegaId": 1,
  "tipoMovimiento": "entrada",
  "subtipoMovimiento": "compra",
  "cantidad": 10,
  "costoUnitario": 450000,
  "motivo": "Recepción orden de compra OC-001",
  "numeroDocumento": "OC-001",
  "usuarioId": 1
}
```

### Registrar Venta
```json
POST /inventarios/movimiento
{
  "productoId": 1,
  "bodegaId": 1,
  "tipoMovimiento": "salida",
  "subtipoMovimiento": "venta",
  "cantidad": 2,
  "motivo": "Venta a cliente - Factura 1001",
  "numeroDocumento": "FAC-1001",
  "usuarioId": 1
}
```

### Transferir entre Bodegas
```json
POST /inventarios/transferencia
{
  "productoId": 1,
  "bodegaOrigenId": 1,
  "bodegaDestinoId": 2,
  "cantidad": 3,
  "motivo": "Reposición bodega sucursal",
  "usuarioId": 1
}
```

## Características Técnicas

### Performance
- Índices en campos de búsqueda frecuente
- Paginación en consultas grandes
- Transacciones para operaciones críticas

### Seguridad
- Validación de datos con class-validator
- Soft delete para productos
- Control de concurrencia en movimientos

### Escalabilidad
- Diseño modular con servicios separados
- Repositorio pattern con TypeORM
- Configuración asíncrona de base de datos

## Próximas Funcionalidades

1. **Órdenes de Compra**: Gestión completa del ciclo de compras
2. **Órdenes de Venta**: Gestión completa del ciclo de ventas
3. **Reportes**: Dashboard con métricas y gráficos
4. **Alertas**: Notificaciones por bajo stock
5. **API de Códigos de Barras**: Integración con lectores
6. **Inventario Cíclico**: Programación de conteos físicos

## Soporte

Para dudas o problemas:
1. Revisar logs de la aplicación
2. Verificar configuración de base de datos
3. Consultar documentación de TypeORM y NestJS