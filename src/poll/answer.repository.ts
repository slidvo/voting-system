import { ConflictException, Inject, Logger } from "@nestjs/common";
import { ANSWER_REPOSITORY } from "./poll.constatns";
import { Repository } from "typeorm";
import { Answer } from "./entities/answer.entity";

export class AnswerRepository {
    constructor(
        @Inject(ANSWER_REPOSITORY)
        private readonly answerRepository: Repository<Answer>
    ) { }

    saveAnswers(answers: Answer[]): Promise<Answer[]> {
        return this.answerRepository.save(answers);
    }
}