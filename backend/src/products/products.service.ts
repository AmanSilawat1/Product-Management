import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './products.entity';
import { FindManyOptions, Like } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { PaginationDto } from './dtos/pagination.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
    constructor(private productsRepository: ProductsRepository) { }

    createProduct(body: CreateProductDto) {
        if (body.totalDiscount > body.totalPrice) {
            throw new BadRequestException('Total discount cannot be greater than total price');
        }
        return this.productsRepository.create(body);
    }

    async getAllProducts(paginationDto: PaginationDto) {
        let { page = 1, limit = 10, filter, sort, order = 'ASC' } = paginationDto;
        page = Number(page);
        limit = Number(limit);
        const skip = (page - 1) * limit;

        const findOptions: FindManyOptions<Product> = {
            skip: skip,
            take: limit,
        };

        if (filter) { // will work as lowercase
            findOptions.where = {
                title: Like(`%${filter}%`)
            }
        }

        if (sort) {
            findOptions.order = {
                [sort]: order
            }
        }

        const [products, total] = await this.productsRepository.findAndCount(findOptions);

        const totalPages = Math.ceil(total / limit);

        return {
            items: products,
            meta: {
                total,
                page,
                limit,
                totalPages
            }
        };
    }

    async update(id: number, attrs: UpdateProductDto) {
        const product = await this.productsRepository.findOne(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this.productsRepository.update(id, attrs);
        return this.productsRepository.findOne(id);
    }


    async remove(id: number) {
        const product = await this.productsRepository.findOne(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return this.productsRepository.softDelete(id);
    }

    async restore(id: number) {
        return this.productsRepository.restore(id);
    }

}
