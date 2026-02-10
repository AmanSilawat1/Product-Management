import { Expose, Type } from 'class-transformer';
import { ProductDto } from './product.dto';

class MetaDto {
    @Expose()
    total: number;

    @Expose()
    page: number;

    @Expose()
    limit: number;

    @Expose()
    totalPages: number;
}

export class ProductsListDto {
    @Expose()
    @Type(() => ProductDto)
    data: ProductDto[];

    @Expose()
    @Type(() => MetaDto)
    meta: MetaDto;
}
