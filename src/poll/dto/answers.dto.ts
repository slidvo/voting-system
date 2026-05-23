import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class AnswersDto {
    @IsArray()
    @IsNotEmpty()
    answers: AnswerDto[];
}

class AnswerDto {
    @IsNumber()
    optionId: number;
}