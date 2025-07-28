import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Importar todas las entidades del modelo de gestión de equipamiento
import { Equipos } from './entities/equipos.entity';
import { DocumentosEquipo } from './entities/documentos-equipo.entity';
import { Categorias } from './entities/categorias.entity';
import { Subcategorias } from './entities/subcategorias.entity';
import { ModalidadesAdquisicion } from './entities/modalidades-adquisicion.entity';
import { Proveedores } from './entities/proveedores.entity';
import { Licitaciones } from './entities/licitaciones.entity';
import { Asignaciones } from './entities/asignaciones.entity';
import { EstadosStock } from './entities/estados-stock.entity';
import { Movimientos } from './entities/movimientos.entity';
import { Usuarios } from './entities/usuarios.entity';
import { Perfiles } from './entities/perfiles.entity';
import { Auditoria } from './entities/auditoria.entity';
import { InventariosFisicos } from './entities/inventarios-fisicos.entity';
import { Configuraciones } from './entities/configuraciones.entity';
import { LogsSistema } from './entities/logs-sistema.entity';
import { Bodegas } from './entities/bodegas.entity';
import { Ubicaciones } from './entities/ubicaciones.entity';
import { MovimientosFisicos } from './entities/movimientos-fisicos.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<string>('DB_TYPE') as any || 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '5432', 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
        entities: [
          Equipos,
          DocumentosEquipo,
          Categorias,
          Subcategorias,
          ModalidadesAdquisicion,
          Proveedores,
          Licitaciones,
          Asignaciones,
          EstadosStock,
          Movimientos,
          Usuarios,
          Perfiles,
          Auditoria,
          InventariosFisicos,
          Configuraciones,
          LogsSistema,
          Bodegas,
          Ubicaciones,
          MovimientosFisicos,
        ],
      }),
    }),
  ],
})
export class AppModule {}
