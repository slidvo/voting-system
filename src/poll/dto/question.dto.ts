import { IsArray, IsString } from "class-validator";
import { OptionDto } from "./option.dto";

export class QuestionDto {
    @IsString()
    text!: string;
    @IsArray()
    options!: OptionDto[];
}