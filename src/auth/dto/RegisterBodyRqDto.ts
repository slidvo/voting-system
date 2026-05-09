import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterBodyRqDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @Length(6, 32)
    @IsNotEmpty()
    @IsString()
    password!: string;
}
