-- ================================
-- SCRIPT PARA SISTEMA DE INVENTARIO
-- Base de datos PostgreSQL
-- ================================

-- Crear extensión para UUIDs si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- TABLAS PRINCIPALES
-- ================================

-- Tabla de Categorías
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    es_activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Proveedores
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    razon_social VARCHAR(255),
    rut VARCHAR(20) UNIQUE NOT NULL,
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(50),
    telefono VARCHAR(15),
    email VARCHAR(100),
    contacto_principal VARCHAR(100),
    telefono_contacto VARCHAR(15),
    email_contacto VARCHAR(100),
    dias_plazo_entrega INT DEFAULT 7,
    forma_pago VARCHAR(100),
    es_activo BOOLEAN DEFAULT TRUE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos (principal)
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo_producto VARCHAR(100) UNIQUE NOT NULL,
    codigo_barras VARCHAR(100) UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio_costo DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock_minimo INT DEFAULT 0,
    stock_maximo INT DEFAULT 0,
    punto_reorden INT DEFAULT 0,
    unidad_medida VARCHAR(50) DEFAULT 'unidad',
    peso_kg DECIMAL(8,3),
    dimensiones VARCHAR(100),
    requiere_refrigeracion BOOLEAN DEFAULT FALSE,
    es_activo BOOLEAN DEFAULT TRUE,
    imagen_url TEXT,
    categoria_id INT,
    proveedor_principal_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (proveedor_principal_id) REFERENCES proveedores(id)
);

-- Actualizar tabla de bodegas existente (si no tiene estos campos)
ALTER TABLE bodegas ADD COLUMN IF NOT EXISTS codigo_bodega VARCHAR(20) UNIQUE;
ALTER TABLE bodegas ADD COLUMN IF NOT EXISTS tipo_bodega VARCHAR(50) DEFAULT 'general';
ALTER TABLE bodegas ADD COLUMN IF NOT EXISTS capacidad_maxima INT;
ALTER TABLE bodegas ADD COLUMN IF NOT EXISTS es_activa BOOLEAN DEFAULT TRUE;
ALTER TABLE bodegas ADD COLUMN IF NOT EXISTS descripcion TEXT;
ALTER TABLE bodegas ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE bodegas ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Tabla de Inventarios (cantidad por producto por bodega)
CREATE TABLE inventarios (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL,
    bodega_id INT NOT NULL,
    cantidad_actual INT DEFAULT 0,
    cantidad_reservada INT DEFAULT 0,
    cantidad_disponible INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    stock_maximo INT DEFAULT 0,
    punto_reorden INT DEFAULT 0,
    ubicacion_fisica VARCHAR(100),
    codigo_ubicacion VARCHAR(50),
    fecha_ultimo_movimiento TIMESTAMP,
    costo_promedio DECIMAL(10,2) DEFAULT 0,
    es_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (bodega_id) REFERENCES bodegas(id_bodega),
    UNIQUE(producto_id, bodega_id)
);

-- Tabla de Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    razon_social VARCHAR(255),
    rut VARCHAR(20) UNIQUE NOT NULL,
    tipo_cliente VARCHAR(50) DEFAULT 'natural',
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(50),
    telefono VARCHAR(15),
    email VARCHAR(100),
    contacto_principal VARCHAR(100),
    telefono_contacto VARCHAR(15),
    email_contacto VARCHAR(100),
    limite_credito DECIMAL(12,2) DEFAULT 0,
    dias_credito INT DEFAULT 0,
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    es_activo BOOLEAN DEFAULT TRUE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Órdenes de Compra
CREATE TABLE ordenes_compra (
    id SERIAL PRIMARY KEY,
    numero_orden VARCHAR(50) UNIQUE NOT NULL,
    proveedor_id INT NOT NULL,
    fecha_orden DATE NOT NULL,
    fecha_esperada_entrega DATE,
    fecha_entrega_real DATE,
    estado VARCHAR(50) DEFAULT 'pendiente',
    subtotal DECIMAL(12,2) DEFAULT 0,
    impuesto DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    porcentaje_impuesto DECIMAL(5,2) DEFAULT 19,
    forma_pago VARCHAR(100),
    condiciones_pago TEXT,
    observaciones TEXT,
    usuario_crea_id INT,
    usuario_aprueba_id INT,
    fecha_aprobacion TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- Tabla de Detalle de Órdenes de Compra
CREATE TABLE detalle_ordenes_compra (
    id SERIAL PRIMARY KEY,
    orden_compra_id INT NOT NULL,
    producto_id INT NOT NULL,
    bodega_destino_id INT NOT NULL,
    cantidad_ordenada INT NOT NULL,
    cantidad_recibida INT DEFAULT 0,
    cantidad_pendiente INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    descuento_valor DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(12,2) NOT NULL,
    fecha_esperada_entrega DATE,
    fecha_recepcion DATE,
    estado VARCHAR(50) DEFAULT 'pendiente',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (bodega_destino_id) REFERENCES bodegas(id_bodega)
);

-- Tabla de Órdenes de Venta
CREATE TABLE ordenes_venta (
    id SERIAL PRIMARY KEY,
    numero_orden VARCHAR(50) UNIQUE NOT NULL,
    cliente_id INT NOT NULL,
    fecha_orden DATE NOT NULL,
    fecha_entrega_solicitada DATE,
    fecha_entrega_real DATE,
    estado VARCHAR(50) DEFAULT 'pendiente',
    subtotal DECIMAL(12,2) DEFAULT 0,
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    descuento_valor DECIMAL(12,2) DEFAULT 0,
    impuesto DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    porcentaje_impuesto DECIMAL(5,2) DEFAULT 19,
    forma_pago VARCHAR(100),
    condiciones_pago TEXT,
    direccion_entrega TEXT,
    contacto_entrega VARCHAR(100),
    telefono_entrega VARCHAR(15),
    observaciones TEXT,
    usuario_crea_id INT,
    usuario_aprueba_id INT,
    fecha_aprobacion TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Tabla de Detalle de Órdenes de Venta
CREATE TABLE detalle_ordenes_venta (
    id SERIAL PRIMARY KEY,
    orden_venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    bodega_origen_id INT NOT NULL,
    cantidad_solicitada INT NOT NULL,
    cantidad_despachada INT DEFAULT 0,
    cantidad_pendiente INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    descuento_valor DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(12,2) NOT NULL,
    fecha_despacho DATE,
    estado VARCHAR(50) DEFAULT 'pendiente',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (orden_venta_id) REFERENCES ordenes_venta(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (bodega_origen_id) REFERENCES bodegas(id_bodega)
);

-- Tabla de Movimientos de Inventario (historial de todos los movimientos)
CREATE TABLE movimientos_inventario (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL,
    bodega_id INT NOT NULL,
    tipo_movimiento VARCHAR(50) NOT NULL,
    subtipo_movimiento VARCHAR(50),
    numero_documento VARCHAR(50),
    cantidad_anterior INT NOT NULL,
    cantidad_movimiento INT NOT NULL,
    cantidad_nueva INT NOT NULL,
    costo_unitario DECIMAL(10,2),
    costo_total DECIMAL(12,2),
    motivo TEXT,
    usuario_id INT,
    orden_compra_id INT,
    orden_venta_id INT,
    transferencia_id INT,
    bodega_destino_id INT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (bodega_id) REFERENCES bodegas(id_bodega),
    FOREIGN KEY (bodega_destino_id) REFERENCES bodegas(id_bodega),
    FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra(id),
    FOREIGN KEY (orden_venta_id) REFERENCES ordenes_venta(id)
);

-- ================================
-- ÍNDICES PARA MEJORAR PERFORMANCE
-- ================================

-- Índices en productos
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_proveedor ON productos(proveedor_principal_id);
CREATE INDEX idx_productos_codigo ON productos(codigo_producto);
CREATE INDEX idx_productos_barras ON productos(codigo_barras);
CREATE INDEX idx_productos_activo ON productos(es_activo);

-- Índices en inventarios
CREATE INDEX idx_inventarios_producto ON inventarios(producto_id);
CREATE INDEX idx_inventarios_bodega ON inventarios(bodega_id);
CREATE INDEX idx_inventarios_activo ON inventarios(es_activo);

-- Índices en órdenes
CREATE INDEX idx_ordenes_compra_proveedor ON ordenes_compra(proveedor_id);
CREATE INDEX idx_ordenes_compra_fecha ON ordenes_compra(fecha_orden);
CREATE INDEX idx_ordenes_compra_estado ON ordenes_compra(estado);

CREATE INDEX idx_ordenes_venta_cliente ON ordenes_venta(cliente_id);
CREATE INDEX idx_ordenes_venta_fecha ON ordenes_venta(fecha_orden);
CREATE INDEX idx_ordenes_venta_estado ON ordenes_venta(estado);

-- Índices en movimientos
CREATE INDEX idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX idx_movimientos_bodega ON movimientos_inventario(bodega_id);
CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha_movimiento);
CREATE INDEX idx_movimientos_tipo ON movimientos_inventario(tipo_movimiento);

-- ================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ================================

-- Trigger para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventarios_updated_at BEFORE UPDATE ON inventarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ordenes_compra_updated_at BEFORE UPDATE ON ordenes_compra 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ordenes_venta_updated_at BEFORE UPDATE ON ordenes_venta 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- DATOS DE EJEMPLO
-- ================================

-- Insertar categorías básicas
INSERT INTO categorias (nombre, descripcion) VALUES 
('Electrónicos', 'Dispositivos electrónicos y tecnológicos'),
('Oficina', 'Suministros y equipos de oficina'),
('Hogar', 'Artículos para el hogar'),
('Salud', 'Productos de salud y cuidado personal');

-- Insertar proveedores básicos
INSERT INTO proveedores (nombre, rut, direccion, telefono, email, contacto_principal) VALUES 
('Proveedor Tech SpA', '76123456-7', 'Av. Providencia 1234, Santiago', '+56912345678', 'ventas@proveedortech.cl', 'Juan Pérez'),
('Suministros Oficina Ltda', '96987654-3', 'Av. Libertador 5678, Santiago', '+56987654321', 'pedidos@suministros.cl', 'María González'),
('Distribuidora Nacional SA', '99111222-K', 'Av. Independencia 9999, Santiago', '+56911223344', 'comercial@distribuidora.cl', 'Carlos Silva');

-- Insertar productos básicos
INSERT INTO productos (codigo_producto, nombre, descripcion, precio_costo, precio_venta, categoria_id, proveedor_principal_id, stock_minimo, stock_maximo, punto_reorden) VALUES 
('LAPTOP-001', 'Laptop HP Pavilion', 'Laptop HP Pavilion 15.6" Intel i5 8GB RAM 256GB SSD', 450000, 599000, 1, 1, 5, 20, 10),
('MOUSE-001', 'Mouse Inalámbrico Logitech', 'Mouse inalámbrico Logitech M705 con batería de larga duración', 25000, 35000, 1, 1, 10, 50, 20),
('PAPEL-001', 'Resma Papel Carta', 'Resma de papel carta 75g 500 hojas blanco', 3500, 5500, 2, 2, 20, 100, 40),
('SILLA-001', 'Silla Ergonómica', 'Silla ergonómica para oficina con soporte lumbar', 85000, 125000, 2, 3, 5, 25, 10);

-- Insertar bodegas si no existen
INSERT INTO bodegas (nombre, direccion, codigo_bodega, tipo_bodega) VALUES 
('Bodega Principal', 'Av. Industrial 1000, Santiago', 'BP001', 'general'),
('Bodega Refrigerada', 'Av. Industrial 1002, Santiago', 'BR001', 'refrigerada'),
('Bodega Sucursal Norte', 'Av. Norte 500, Providencia', 'BSN001', 'general')
ON CONFLICT (codigo_bodega) DO NOTHING;

-- Insertar inventarios iniciales
INSERT INTO inventarios (producto_id, bodega_id, cantidad_actual, cantidad_disponible, stock_minimo, stock_maximo, punto_reorden) VALUES 
(1, 1, 15, 15, 5, 20, 10),
(2, 1, 35, 35, 10, 50, 20),
(3, 1, 60, 60, 20, 100, 40),
(4, 1, 12, 12, 5, 25, 10),
(1, 2, 8, 8, 3, 15, 8),
(2, 2, 25, 25, 8, 40, 15);

-- Insertar clientes básicos
INSERT INTO clientes (nombre, rut, tipo_cliente, direccion, telefono, email) VALUES 
('Empresa ABC Ltda', '76555666-7', 'juridico', 'Av. Las Condes 1234, Las Condes', '+56912345678', 'compras@empresaabc.cl'),
('Juan Carlos Pérez', '12345678-9', 'natural', 'Calle Falsa 123, Santiago', '+56987654321', 'jcperez@email.com'),
('Corporación XYZ SA', '96111222-3', 'juridico', 'Av. Apoquindo 5678, Las Condes', '+56911223344', 'adquisiciones@corpxyz.cl');

-- ================================
-- COMENTARIOS FINALES
-- ================================

-- Este script crea la estructura completa del sistema de inventario
-- Incluye todas las tablas, relaciones, índices y triggers necesarios
-- Para un funcionamiento óptimo del sistema

COMMENT ON TABLE productos IS 'Tabla principal de productos del inventario';
COMMENT ON TABLE inventarios IS 'Cantidad de productos por bodega con stock mínimo y máximo';
COMMENT ON TABLE movimientos_inventario IS 'Historial completo de todos los movimientos de inventario';
COMMENT ON TABLE ordenes_compra IS 'Órdenes de compra a proveedores';
COMMENT ON TABLE ordenes_venta IS 'Órdenes de venta a clientes';