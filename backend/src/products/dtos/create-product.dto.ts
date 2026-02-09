import { IsString, IsNumber, Min, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
    @IsNumber()
    orderId: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    totalPrice: number;

    @IsNumber()
    totalDiscount: number;
}