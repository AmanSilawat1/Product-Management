import { IsString, IsNumber, Min, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
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