import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { QuestionDto } from "./question.dto";

export class CreatePollDto {
    @ApiProperty({ example: 'Favourite season' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: 'Vote for your favourite season of the year' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ type: [QuestionDto] })
    @IsNotEmpty({ each: true })
    @IsArray()
    questions: QuestionDto[];
}
