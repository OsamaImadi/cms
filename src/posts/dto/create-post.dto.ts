import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    body: string;

    @IsOptional()
    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    summary: string;

    @IsNotEmpty()
    @Transform(({ value }) => {
        return +value
    })
    @IsNumber()
    author: number;

    @IsOptional()
    @Transform(({ value }) => {
        return value.replace(/\[|\]/g, '')
        .split(',')
        .map(Number);
    })
    @IsArray()
    categories: number[];

    @IsOptional()
    @Transform(({ value }) => {
        return value.replace(/\[|\]/g, '')
        .split(',')
        .map(Number);
    })
    @IsArray()
    tags: number[];
}
