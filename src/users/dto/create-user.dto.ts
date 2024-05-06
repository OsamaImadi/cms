import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { gender } from '../utils/gender.enum';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    dob: string;

    @IsOptional()
    @IsString()
    website: string;

    @IsOptional()
    @IsEnum(gender)
    gender: string;

    @IsNotEmpty()
    @IsString()
    socialMediaHandler: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsOptional()
    @IsBoolean()
    status: boolean;

    @IsOptional()
    @IsNumber()
    role: number;

}
