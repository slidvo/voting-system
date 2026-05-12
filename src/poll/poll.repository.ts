import { In, Repository } from "typeorm";
import { Poll } from "./entities/poll.entity";
import { Inject, Injectable } from "@nestjs/common";
import { CreatePollDto } from "./dto/create-poll.dto";
import { POLL_REPOSITORY } from "./poll.constatns";

@Injectable()
export class PollRepository {
    constructor(
        @Inject(POLL_REPOSITORY)
        private readonly pollRepository: Repository<Poll>
    ) { }

    create(createPollDto: CreatePollDto): Promise<Poll> {
        const poll = this.pollRepository.create({
            title: createPollDto.title,
            description: createPollDto.description,
            createdAt: new Date(),
            questions: createPollDto.questions.map(q => {
                return {
                    text: q.text,
                    createdAt: new Date(),
                    options: q.options.map(o => {
                        return {
                            text: o.text,
                            createdAt: new Date()
                        }
                    })
                }
            })
        })

        return this.pollRepository.save(poll);
    }

    findAll(): Promise<Poll[]> {
        return this.pollRepository.find({ relations: ["questions", "questions.options"] });
    }
}