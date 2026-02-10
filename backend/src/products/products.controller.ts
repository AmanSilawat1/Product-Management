import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { PaginationDto } from './dtos/pagination.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ProductDto } from './dtos/product.dto';
import { ProductsListDto } from './dtos/products-list.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Post()
    @Serialize(ProductDto)
    createProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }

    @Get()
    @Serialize(ProductsListDto)
    getAllProducts(@Query() query: PaginationDto) {
        return this.productsService.getAllProducts(query);
    }
}
