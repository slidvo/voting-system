import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { QuestionDto } from "./question.dto";

export class CreatePollDto {
    @IsNotEmpty()
    @IsString()
    title: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty({ each: true })
    @IsArray()
    questions: QuestionDto[];
}
