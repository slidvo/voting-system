import { IsNotEmpty, IsString, Length } from "class-validator";

export class HelloBodyRqDto {
    @IsNotEmpty()
    @IsString()
    login!: string;

    @Length(6, 16)
    @IsNotEmpty()
    @IsString()
    password!: string;
} 
