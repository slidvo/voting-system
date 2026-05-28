import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePollDto } from './dto/create-poll.dto'
import { UpdatePollDto } from './dto/update-poll.dto'
import { PollRepository } from './poll.repository'
import { PollsDto } from './dto/polls.dto'
import { PollDto } from './dto/poll.dto'
import { AnswerRepository } from './answer.repository'
import { PollGateway } from './poll.gateway'
import { Poll } from './entities/poll.entity'
import { Question } from './entities/question.entity'
import { Option } from './entities/option.entity'

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);

  constructor(
    private readonly pollRepository: PollRepository,
    private readonly answerRepository: AnswerRepository,
    private readonly pollGateway: PollGateway
  ) { }

  async create(createPollDto: CreatePollDto) {
    try {
      return await this.pollRepository.create(createPollDto);
    } catch (error) {
      this.logger.error('Failed to create poll', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  async findAll(): Promise<PollsDto> {
    try {
      const pollsArray = (await this.pollRepository.findAll()).map((poll) => ({
        id: poll.id,
        title: poll.title,
        description: poll.description,
        createdBy: poll.creator.name,
      }));
      return { polls: pollsArray, totalPolls: pollsArray.length };
    } catch (error) {
      this.logger.error('Failed to fetch polls', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  async findOne(id: number): Promise<PollDto> {
    let poll: Poll | null;
    try {
      poll = await this.pollRepository.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to fetch poll ${id} from DB`, error instanceof Error ? error.stack : String(error));
      throw error;
    }

    if (!poll) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      questions: poll.questions!.map((question: Question) => ({
        id: question.id,
        text: question.text,
        options: question.options!.map((option: Option) => ({
          id: option.id,
          text: option.text,
        })),
      })),
    };
  }

  async savePollAnswers(params: { pollId: number; userId: number; options: number[] }) {
    const { userId, pollId, options } = params;
    const answers = options.map((optionId) => ({
      userId,
      optionId,
      createdAt: new Date(),
    }));
    try {
      await this.answerRepository.saveAnswers(answers);
      await this.pollGateway.broadcastResults(pollId);
    } catch (error) {
      this.logger.error(`Failed to save answers for poll ${pollId} by user ${userId}`, error instanceof Error ? error.stack : String(error));
      if ((error as any).code === '23505') {
        throw new ConflictException('User has already answered this poll!');
      }
      throw new Error('Failed to save poll answers');
    }
  }

  async update(id: number, updatePollDto: UpdatePollDto, userId: number) {
    try {
      const poll = await this.pollRepository.update(id, updatePollDto, userId);
      const { title, description, isActive } = poll;
      return { title, description, isActive };
    } catch (error) {
      this.logger.error(`Failed to update poll ${id}`, error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} poll`;
  }

  async getPollResults(pollId: number) {
    let poll: Poll | null;
    try {
      poll = await this.pollRepository.findOneWithResults(pollId);
    } catch (error) {
      this.logger.error(`Failed to fetch results for poll ${pollId}`, error instanceof Error ? error.stack : String(error));
      throw error;
    }

    if (!poll) {
      throw new NotFoundException(`Poll ${pollId} not found`);
    }

    if (!poll.questions) {
      throw new NotFoundException(`Poll ${pollId} .questions  not found`);
    }

    return {
      pollId: poll.id,
      title: poll.title,
      questions: poll.questions.map((question: Question) => ({
        questionId: question.id,
        text: question.text,
        options: question.options!.map((option: Option) => ({
          optionId: option.id,
          text: option.text,
          votes: option.answers!.length,
        })),
      })),
    };
  }

  async findAllByUserId(userId: number): Promise<PollsDto> {
    try {
      const pollsArray = (await this.pollRepository.findAllByUserId(userId)).map((poll) => ({
        id: poll.id,
        title: poll.title,
        description: poll.description,
        createdBy: poll.creator.name,
      }));
      return { polls: pollsArray, totalPolls: pollsArray.length };
    } catch (error) {
      this.logger.error(`Failed to fetch polls for user ${userId}`, error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }
}
