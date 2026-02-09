import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { Order } from '../orders/order.entity';

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Product) private productRepo: Repository<Product>) { }

    createProduct(body: CreateProductDto) {
        if (body.totalDiscount > body.totalPrice) {
            throw new BadRequestException('Total discount cannot be greater than total price');
        }
        const product = this.productRepo.create({
            ...body,
            order: { id: body.orderId } as Order
        });
        return this.productRepo.save(product);
    }



}
