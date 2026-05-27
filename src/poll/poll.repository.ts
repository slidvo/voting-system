import { In, Repository } from "typeorm";
import { Poll } from "./entities/poll.entity";
import { Inject, Injectable } from "@nestjs/common";
import { CreatePollDto } from "./dto/create-poll.dto";
import { POLL_REPOSITORY } from "./poll.constatns";
import { UpdatePollDto } from "./dto/update-poll.dto";

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
        return this.pollRepository.find({ relations: ["questions", "questions.options", "creator"], where: { isActive: true } });
    }

    findAllByUserId(userId: number): Promise<Poll[]> {
        return this.pollRepository.find({
            where: {
                createdBy: userId,
            },
            relations: ["questions", "questions.options", "creator"]
        });
    }

    findOne(id: number): Promise<Poll | null> {
        return this.pollRepository.findOne({ where: { id }, relations: ["questions", "questions.options", "creator"] });
    }

    findOneWithResults(pollId: number): Promise<Poll | null> {
        return this.pollRepository.findOne({
            where: { id: pollId },
            relations: [
                'questions',
                'questions.options',
                'questions.options.answers',
            ],
        });
    }

    async update(id: number, updatePollDto: UpdatePollDto, userId: number) {
        const poll = await this.pollRepository.findOne({ where: { id, createdBy: userId } });
        if (!poll) {
            throw new Error(`Poll with ID ${id} not found or you don't have permission to update it`);
        }
        
        Object.assign(poll, updatePollDto, { updatedAt: new Date() });
        
        return this.pollRepository.save(poll);
    }
}