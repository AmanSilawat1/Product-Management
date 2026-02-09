import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Post()
    createProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }


}
