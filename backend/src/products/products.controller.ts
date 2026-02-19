import { Body, Controller, Post, Get, Query, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { PaginationDto } from './dtos/pagination.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './products.entity';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface PaginatedResponse<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Post()
    // generics types for return response
    async createProduct(@Body() body: CreateProductDto): Promise<ApiResponse<Product>> {
        const product = await this.productsService.createProduct(body);
        return {
            success: true,
            message: 'Product created successfully',
            data: product,
        };
    }

    @Get()
    async getAllProducts(@Query() query: PaginationDto): Promise<ApiResponse<PaginatedResponse<Product>>> {
        const result = await this.productsService.getAllProducts(query);
        return {
            success: true,
            message: 'Products retrieved successfully',
            data: result,
        };
    }

    @Patch('/:id')
    async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto): Promise<ApiResponse<Product | null>> {
        const product = await this.productsService.update(parseInt(id), body);
        return {
            success: true,
            message: 'Product updated successfully',
            data: product,
        };
    }

    @Delete('/:id')
    async removeProduct(@Param('id') id: string): Promise<ApiResponse<null>> {
        await this.productsService.remove(parseInt(id));
        return {
            success: true,
            message: 'Product removed successfully',
            data: null,
        };
    }

    @Patch('/:id/restore')
    async restoreProduct(@Param('id') id: string): Promise<ApiResponse<null>> {
        await this.productsService.restore(parseInt(id));
        return {
            success: true,
            message: 'Product restored successfully',
            data: null,
        };
    }
}
