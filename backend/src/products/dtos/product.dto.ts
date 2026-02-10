import { Expose, Transform } from 'class-transformer';

export class ProductDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    quantity: number;

    @Expose()
    totalPrice: number;

    @Expose()
    totalDiscount: number;

    @Transform(({ obj }) => obj.order.id)
    @Expose()
    orderId: number;
}
