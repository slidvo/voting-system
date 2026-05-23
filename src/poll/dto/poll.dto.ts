import { IsArray, IsNumber, IsString } from "class-validator";
import { QuestionDto } from "./question.dto";

export class PollDto {
    @IsNumber()
    id!: number;
    @IsString()
    title!: string;
    @IsString()
    description!: string;
    @IsArray()
    questions!: QuestionDto[];
} 