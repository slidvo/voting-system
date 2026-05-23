import { IsString } from "class-validator";

export class OptionDto {
    @IsString()
    text: string;
}