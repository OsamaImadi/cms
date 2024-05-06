import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
             return value;
    })
    @IsBoolean()
    active: boolean;
}
