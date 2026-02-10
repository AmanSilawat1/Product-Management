import { Body, Controller, Post, Get, Query, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { PaginationDto } from './dtos/pagination.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ProductDto } from './dtos/product.dto';
import { ProductsListDto } from './dtos/products-list.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

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

    @Patch('/:id')
    updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
        return this.productsService.update(parseInt(id), body);
    }

    @Delete('/:id')
    removeProduct(@Param('id') id: string) {
        return this.productsService.remove(parseInt(id));
    }

    @Patch('/:id/restore')
    restoreProduct(@Param('id') id: string) {
        return this.productsService.restore(parseInt(id));
    }
}
