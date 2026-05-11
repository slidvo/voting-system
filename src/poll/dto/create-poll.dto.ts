import { QuestionDto } from "./question.dto";

export class CreatePollDto {
    title: string;
    description: string
    questions: QuestionDto[]
}
