import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    body: string;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    postId: number;

    @IsOptional()
    @IsNumber()
    replyCommentId: number;

    @IsOptional()
    @IsNumber()
    parentCommentId: number;
}
