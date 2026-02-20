import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    quantity?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    totalPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    totalDiscount?: number;

}
