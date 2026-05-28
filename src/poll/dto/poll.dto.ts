import { IsArray, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { QuestionDto } from "./question.dto";

export class PollDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id!: number;

    @ApiProperty({ example: 'Favourite season' })
    @IsString()
    title!: string;

    @ApiProperty({ example: 'Vote for your favourite season' })
    @IsString()
    description!: string;

    @ApiProperty({ type: [QuestionDto] })
    @IsArray()
    questions!: QuestionDto[];
}