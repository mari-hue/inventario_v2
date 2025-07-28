import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    try {
      const producto = this.productoRepository.create(createProductoDto);
      return await this.productoRepository.save(producto);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new ConflictException('El código del producto o código de barras ya existe');
      }
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{
    data: Producto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const whereCondition = search ? [
      { nombre: Like(`%${search}%`) },
      { codigoProducto: Like(`%${search}%`) },
      { descripcion: Like(`%${search}%`) }
    ] : {};

    const [data, total] = await this.productoRepository.findAndCount({
      where: whereCondition,
      relations: ['categoria', 'proveedorPrincipal', 'inventarios'],
      skip,
      take: limit,
      order: { fechaCreacion: 'DESC' }
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria', 'proveedorPrincipal', 'inventarios', 'inventarios.bodega']
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async findByCodigoProducto(codigo: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { codigoProducto: codigo },
      relations: ['categoria', 'proveedorPrincipal', 'inventarios']
    });

    if (!producto) {
      throw new NotFoundException(`Producto con código ${codigo} no encontrado`);
    }

    return producto;
  }

  async findByCodigoBarras(codigoBarras: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { codigoBarras },
      relations: ['categoria', 'proveedorPrincipal', 'inventarios']
    });

    if (!producto) {
      throw new NotFoundException(`Producto con código de barras ${codigoBarras} no encontrado`);
    }

    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    
    try {
      Object.assign(producto, updateProductoDto);
      return await this.productoRepository.save(producto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El código del producto o código de barras ya existe');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    
    // Soft delete - marcar como inactivo en lugar de eliminar
    producto.esActivo = false;
    await this.productoRepository.save(producto);
  }

  async findProductosBajoStock(): Promise<Producto[]> {
    return await this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.inventarios', 'inventario')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .where('inventario.cantidad_actual <= inventario.punto_reorden')
      .andWhere('producto.es_activo = true')
      .getMany();
  }

  async getEstadisticasProductos(): Promise<{
    totalProductos: number;
    productosActivos: number;
    productosInactivos: number;
    productosBajoStock: number;
  }> {
    const totalProductos = await this.productoRepository.count();
    const productosActivos = await this.productoRepository.count({ where: { esActivo: true } });
    const productosInactivos = totalProductos - productosActivos;
    
    const productosBajoStock = await this.productoRepository
      .createQueryBuilder('producto')
      .leftJoin('producto.inventarios', 'inventario')
      .where('inventario.cantidad_actual <= inventario.punto_reorden')
      .andWhere('producto.es_activo = true')
      .getCount();

    return {
      totalProductos,
      productosActivos,
      productosInactivos,
      productosBajoStock
    };
  }
}