import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { PaginationDto } from './dtos/pagination.dto';
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

    async getAllProducts(paginationDto: PaginationDto) {
        const { page = 1, limit = 10, filter, sort, order = 'ASC' } = paginationDto;
        const skip = (page - 1) * limit;

        const findOptions: FindManyOptions<Product> = {
            skip: skip,
            take: limit,
            relations: {
                order: true
            },
        };

        if (filter) {
            findOptions.where = {
                title: Like(`%${filter}%`)
            }
        }

        if (sort) {
            findOptions.order = {
                [sort]: order
            }
        }

        const products = await this.productRepo.find(findOptions);

        return products.map((product) => ({
            id: product.id,
            orderId: product.order.id,
            title: product.title,
            description: product.description,
            quantity: product.quantity,
            totalPrice: product.totalPrice,
            totalDiscount: product.totalDiscount,
        }));
    }

}
