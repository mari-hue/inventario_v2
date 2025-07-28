import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EquipoModule } from './equipo/equipos.module';
import { BodegaModule } from './bodega/bodega.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';
import { LotesModule } from './lotes/lotes.module';
import { TransferenciasModule } from './transferencias/transferencias.module';
import { ReportesModule } from './reportes/reportes.module';
import { TipoProductoModule } from './tipo-producto/tipo-producto.module';
import { PersonaModule } from './persona/persona.module';
import { PerfilModule } from './perfil/perfil.module';
import { UsuarioModule } from './usuario/usuario.module';  
import { ProductosModule } from './productos/productos.module';
import { InventariosModule } from './inventarios/inventarios.module';

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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),

    EquipoModule,
    BodegaModule,
    UbicacionesModule,
    LotesModule,
    TransferenciasModule,
    ReportesModule,
    TipoProductoModule,
    PersonaModule,
    PerfilModule,     
    UsuarioModule,
    ProductosModule,
    InventariosModule,
  ],
})
export class AppModule {}
