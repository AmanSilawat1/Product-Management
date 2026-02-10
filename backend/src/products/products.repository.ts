import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { Order } from '../orders/order.entity';

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Product)
        private repo: Repository<Product>
    ) { }

    create(productData: CreateProductDto) {
        const product = this.repo.create({
            ...productData,
            order: { id: productData.orderId } as Order
        });
        return this.repo.save(product);
    }

    findAndCount(options: FindManyOptions<Product>) {
        return this.repo.findAndCount(options);
    }
}
