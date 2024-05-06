import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { roles } from "../utils/role.enum";

export class CreateRoleDto {
    @IsNotEmpty()
    @IsEnum(roles)
    name: string;

    @IsOptional()
    @IsBoolean()
    status: boolean;
}
