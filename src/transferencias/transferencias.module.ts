import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferenciasController } from './transferencias.controller';
import { TransferenciasService } from './transferencias.service';
import { Transferencia } from '../entities/transferencia.entity';
import { TransferenciaDetalle } from '../entities/transferencia-detalle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transferencia, TransferenciaDetalle])],
  controllers: [TransferenciasController],
  providers: [TransferenciasService],
  exports: [TransferenciasService],
})
export class TransferenciasModule {}