import { IsArray, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { OptionDto } from "./option.dto";

export class QuestionDto {
    @ApiProperty({ example: 'What is your favourite color?' })
    @IsString()
    text!: string;

    @ApiProperty({ type: [OptionDto] })
    @IsArray()
    options!: OptionDto[];
}