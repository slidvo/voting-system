import { IsArray, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AnswerItemDto {
    @ApiProperty({ example: 3 })
    @IsNumber()
    optionId: number;
}

export class AnswersDto {
    @ApiProperty({ type: [AnswerItemDto] })
    @IsArray()
    @IsNotEmpty()
    answers: AnswerItemDto[];
}