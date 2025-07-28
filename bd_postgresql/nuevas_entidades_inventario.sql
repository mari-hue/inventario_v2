-- ================================
-- SCRIPT PARA NUEVAS ENTIDADES DEL SISTEMA DE INVENTARIO
-- Entidades faltantes según modelo estándar
-- ================================

-- Crear extensión para UUIDs si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- TABLA DE UBICACIONES
-- ================================

CREATE TABLE ubicaciones (
    id SERIAL PRIMARY KEY,
    codigo_ubicacion VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    ciudad VARCHAR(100),
    region VARCHAR(50),
    pais VARCHAR(50),
    codigo_postal VARCHAR(10),
    latitud DECIMAL(10,6),
    longitud DECIMAL(10,6),
    zona_horaria VARCHAR(50),
    es_activa BOOLEAN DEFAULT TRUE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar relación de ubicación a bodegas existente
ALTER TABLE bodegas ADD COLUMN IF NOT EXISTS ubicacion_id INT;
ALTER TABLE bodegas ADD CONSTRAINT fk_bodegas_ubicacion 
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id);

-- ================================
-- TABLA DE LOTES DE PRODUCTOS
-- ================================

CREATE TABLE lotes_producto (
    id SERIAL PRIMARY KEY,
    numero_lote VARCHAR(100) UNIQUE NOT NULL,
    fecha_fabricacion DATE,
    fecha_vencimiento DATE,
    cantidad_inicial INT NOT NULL,
    cantidad_actual INT DEFAULT 0,
    costo_unitario DECIMAL(10,2) NOT NULL,
    numero_orden_compra VARCHAR(50),
    certificado_calidad VARCHAR(255),
    es_activo BOOLEAN DEFAULT TRUE,
    observaciones TEXT,
    producto_id INT NOT NULL,
    proveedor_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- ================================
-- TABLA DE INVENTARIO POR LOTES
-- ================================

CREATE TABLE inventario_lotes (
    id SERIAL PRIMARY KEY,
    cantidad_actual INT DEFAULT 0,
    cantidad_reservada INT DEFAULT 0,
    cantidad_disponible INT DEFAULT 0,
    ubicacion_fisica VARCHAR(100),
    codigo_ubicacion VARCHAR(50),
    fecha_ultimo_movimiento TIMESTAMP,
    es_activo BOOLEAN DEFAULT TRUE,
    lote_id INT NOT NULL,
    bodega_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (lote_id) REFERENCES lotes_producto(id),
    FOREIGN KEY (bodega_id) REFERENCES bodegas(id_bodega),
    UNIQUE(lote_id, bodega_id)
);

-- ================================
-- TABLA DE TRANSFERENCIAS
-- ================================

CREATE TABLE transferencias (
    id SERIAL PRIMARY KEY,
    numero_transferencia VARCHAR(50) UNIQUE NOT NULL,
    fecha_solicitud DATE NOT NULL,
    fecha_envio DATE,
    fecha_recepcion DATE,
    estado VARCHAR(50) DEFAULT 'pendiente',
    usuario_solicita_id INT NOT NULL,
    usuario_autoriza_id INT,
    usuario_recibe_id INT,
    motivo TEXT,
    observaciones TEXT,
    total_items INT DEFAULT 0,
    costo_total DECIMAL(12,2) DEFAULT 0,
    bodega_origen_id INT NOT NULL,
    bodega_destino_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bodega_origen_id) REFERENCES bodegas(id_bodega),
    FOREIGN KEY (bodega_destino_id) REFERENCES bodegas(id_bodega)
);

-- ================================
-- TABLA DE DETALLE DE TRANSFERENCIAS
-- ================================

CREATE TABLE transferencia_detalles (
    id SERIAL PRIMARY KEY,
    cantidad_solicitada INT NOT NULL,
    cantidad_enviada INT DEFAULT 0,
    cantidad_recibida INT DEFAULT 0,
    costo_unitario DECIMAL(10,2) NOT NULL,
    costo_total DECIMAL(12,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    observaciones TEXT,
    transferencia_id INT NOT NULL,
    producto_id INT NOT NULL,
    lote_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transferencia_id) REFERENCES transferencias(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (lote_id) REFERENCES lotes_producto(id)
);

-- ================================
-- ÍNDICES PARA MEJORAR PERFORMANCE
-- ================================

-- Índices en ubicaciones
CREATE INDEX idx_ubicaciones_codigo ON ubicaciones(codigo_ubicacion);
CREATE INDEX idx_ubicaciones_activa ON ubicaciones(es_activa);

-- Índices en lotes
CREATE INDEX idx_lotes_numero ON lotes_producto(numero_lote);
CREATE INDEX idx_lotes_producto ON lotes_producto(producto_id);
CREATE INDEX idx_lotes_proveedor ON lotes_producto(proveedor_id);
CREATE INDEX idx_lotes_vencimiento ON lotes_producto(fecha_vencimiento);
CREATE INDEX idx_lotes_activo ON lotes_producto(es_activo);

-- Índices en inventario lotes
CREATE INDEX idx_inventario_lotes_lote ON inventario_lotes(lote_id);
CREATE INDEX idx_inventario_lotes_bodega ON inventario_lotes(bodega_id);

-- Índices en transferencias
CREATE INDEX idx_transferencias_numero ON transferencias(numero_transferencia);
CREATE INDEX idx_transferencias_estado ON transferencias(estado);
CREATE INDEX idx_transferencias_origen ON transferencias(bodega_origen_id);
CREATE INDEX idx_transferencias_destino ON transferencias(bodega_destino_id);
CREATE INDEX idx_transferencias_fecha ON transferencias(fecha_solicitud);

-- Índices en detalle transferencias
CREATE INDEX idx_detalle_transferencias_transferencia ON transferencia_detalles(transferencia_id);
CREATE INDEX idx_detalle_transferencias_producto ON transferencia_detalles(producto_id);
CREATE INDEX idx_detalle_transferencias_lote ON transferencia_detalles(lote_id);

-- ================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ================================

-- Aplicar trigger de actualización a las nuevas tablas
CREATE TRIGGER update_ubicaciones_updated_at BEFORE UPDATE ON ubicaciones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lotes_producto_updated_at BEFORE UPDATE ON lotes_producto 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventario_lotes_updated_at BEFORE UPDATE ON inventario_lotes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transferencias_updated_at BEFORE UPDATE ON transferencias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transferencia_detalles_updated_at BEFORE UPDATE ON transferencia_detalles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- DATOS DE EJEMPLO
-- ================================

-- Insertar ubicaciones básicas
INSERT INTO ubicaciones (codigo_ubicacion, nombre, direccion, ciudad, pais) VALUES 
('LOC001', 'Sede Principal', 'Av. Providencia 1234, Santiago', 'Santiago', 'Chile'),
('LOC002', 'Sucursal Norte', 'Av. Libertador 5678, Providencia', 'Santiago', 'Chile'),
('LOC003', 'Centro de Distribución', 'Av. Industrial 9999, Quilicura', 'Santiago', 'Chile');

-- Actualizar bodegas existentes con ubicaciones
UPDATE bodegas SET ubicacion_id = 1 WHERE nombre = 'Bodega Principal';
UPDATE bodegas SET ubicacion_id = 1 WHERE nombre = 'Bodega Refrigerada';
UPDATE bodegas SET ubicacion_id = 2 WHERE nombre = 'Bodega Sucursal Norte';

-- Insertar lotes de ejemplo
INSERT INTO lotes_producto (numero_lote, fecha_fabricacion, fecha_vencimiento, cantidad_inicial, cantidad_actual, costo_unitario, producto_id, proveedor_id) VALUES 
('LT2024001', '2024-01-15', '2026-01-15', 100, 85, 450000, 1, 1),
('LT2024002', '2024-02-01', '2025-08-01', 200, 150, 25000, 2, 1),
('LT2024003', '2024-01-20', NULL, 500, 420, 3500, 3, 2);

-- Insertar inventario por lotes
INSERT INTO inventario_lotes (cantidad_actual, cantidad_disponible, lote_id, bodega_id, ubicacion_fisica) VALUES 
(50, 50, 1, 1, 'Estante A1-01'),
(35, 35, 1, 2, 'Estante B2-03'),
(100, 100, 2, 1, 'Estante A2-05'),
(50, 50, 2, 2, 'Estante B1-02'),
(300, 300, 3, 1, 'Estante C1-01'),
(120, 120, 3, 2, 'Estante C2-01');

-- ================================
-- COMENTARIOS FINALES
-- ================================

COMMENT ON TABLE ubicaciones IS 'Ubicaciones geográficas donde se encuentran las bodegas';
COMMENT ON TABLE lotes_producto IS 'Control de lotes para productos que requieren trazabilidad';
COMMENT ON TABLE inventario_lotes IS 'Inventario específico por lotes en cada bodega';
COMMENT ON TABLE transferencias IS 'Transferencias de productos entre bodegas';
COMMENT ON TABLE transferencia_detalles IS 'Detalle de productos en cada transferencia';

-- ================================
-- VISTA PARA RESUMEN DE INVENTARIO POR LOTES
-- ================================

CREATE OR REPLACE VIEW vista_inventario_lotes AS
SELECT 
    il.id,
    p.codigo_producto,
    p.nombre as producto_nombre,
    lp.numero_lote,
    lp.fecha_vencimiento,
    b.nombre as bodega_nombre,
    u.nombre as ubicacion_nombre,
    il.cantidad_actual,
    il.cantidad_disponible,
    il.cantidad_reservada,
    il.ubicacion_fisica,
    lp.costo_unitario,
    (il.cantidad_actual * lp.costo_unitario) as valor_total,
    CASE 
        WHEN lp.fecha_vencimiento IS NULL THEN 'Sin vencimiento'
        WHEN lp.fecha_vencimiento < CURRENT_DATE THEN 'Vencido'
        WHEN lp.fecha_vencimiento <= CURRENT_DATE + INTERVAL '30 days' THEN 'Vence pronto'
        ELSE 'Vigente'
    END as estado_vencimiento
FROM inventario_lotes il
JOIN lotes_producto lp ON il.lote_id = lp.id
JOIN productos p ON lp.producto_id = p.id
JOIN bodegas b ON il.bodega_id = b.id_bodega
LEFT JOIN ubicaciones u ON b.ubicacion_id = u.id
WHERE il.es_activo = true AND lp.es_activo = true;

-- ================================
-- VISTA PARA TRANSFERENCIAS COMPLETAS
-- ================================

CREATE OR REPLACE VIEW vista_transferencias_completas AS
SELECT 
    t.id,
    t.numero_transferencia,
    t.fecha_solicitud,
    t.fecha_envio,
    t.fecha_recepcion,
    t.estado,
    bo.nombre as bodega_origen,
    bd.nombre as bodega_destino,
    uo.nombre as ubicacion_origen,
    ud.nombre as ubicacion_destino,
    t.total_items,
    t.costo_total,
    t.motivo,
    COUNT(td.id) as total_productos,
    SUM(td.cantidad_solicitada) as cantidad_total_solicitada,
    SUM(td.cantidad_enviada) as cantidad_total_enviada,
    SUM(td.cantidad_recibida) as cantidad_total_recibida
FROM transferencias t
JOIN bodegas bo ON t.bodega_origen_id = bo.id_bodega
JOIN bodegas bd ON t.bodega_destino_id = bd.id_bodega
LEFT JOIN ubicaciones uo ON bo.ubicacion_id = uo.id
LEFT JOIN ubicaciones ud ON bd.ubicacion_id = ud.id
LEFT JOIN transferencia_detalles td ON t.id = td.transferencia_id
GROUP BY t.id, t.numero_transferencia, t.fecha_solicitud, t.fecha_envio, 
         t.fecha_recepcion, t.estado, bo.nombre, bd.nombre, uo.nombre, 
         ud.nombre, t.total_items, t.costo_total, t.motivo;