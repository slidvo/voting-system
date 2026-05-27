import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePollDto } from './dto/create-poll.dto'
import { UpdatePollDto } from './dto/update-poll.dto'
import { PollRepository } from './poll.repository'
import { PollsDto } from './dto/polls.dto'
import { PollDto } from './dto/poll.dto'
import { AnswerRepository } from './answer.repository'
import { PollGateway } from './poll.gateway'
@Injectable()
export class PollService {

  constructor(
    private readonly pollRepository: PollRepository,
    private readonly answerRepository: AnswerRepository,
    private readonly pollGateway: PollGateway
  ) { }

  create(createPollDto: CreatePollDto) {
    return this.pollRepository.create(createPollDto)
  }

  async findAll(): Promise<PollsDto> {
    let pollsArray = (await this.pollRepository.findAll()).map((poll) => {
      return {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        createdBy: poll.creator!.name
      }
    })
    Logger.debug(`polls: ${JSON.stringify(pollsArray)}`)
    return { polls: pollsArray, totalPolls: pollsArray.length }
  }

  async findOne(id: number): Promise<PollDto> {
    const poll = await this.pollRepository.findOne(id);
    if (!poll) {
      throw new Error(`Poll with ID ${id} not found`);
    }

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      questions: poll.questions!.map((question) => ({
        id: question.id,
        text: question.text,
        options: question.options!.map((option) => ({
          id: option.id,
          text: option.text
        }))
      })),
    };
  }


  async savePollAnswers(
    params: {
      pollId: number,
      userId: number,
      options: number[]
    }
  ) {
    const { userId, pollId, options } = params;
    const answers = options.map(optionId => ({
      userId: userId,
      optionId: optionId,
      createdAt: new Date()
    }));
    try {
      await this.answerRepository.saveAnswers(answers)
      await this.pollGateway.broadcastResults(pollId);
    }
    catch (error) {
      Logger.error("Error saving poll answers:", error);
      if ((error as any).code === '23505') { // Unique violation error code in PostgreSQL
        throw new ConflictException('User has already answered this poll!');
      }
      throw new Error('Failed to save poll answers');
    }

  }

  update(id: number, updatePollDto: UpdatePollDto) {
    return `This action updates a #${id} poll`;
  }

  remove(id: number) {
    return `This action removes a #${id} poll`;
  }

  async getPollResults(pollId: number) {
    const poll = await this.pollRepository.findOneWithResults(pollId);

    if (!poll) {
      throw new NotFoundException(`Poll ${pollId} not found`);
    }

    if (!poll.questions) {
      throw new NotFoundException(`Poll ${pollId} .questions  not found`);
    }

    return {
      pollId: poll.id,
      title: poll.title,
      questions: poll.questions.map(question => ({
        questionId: question.id,
        text: question.text,
        options: question.options!.map(option => ({
          optionId: option.id,
          text: option.text,
          votes: option.answers!.length,
        })),
      })),
    };
  }

  async findAllByUserId(userId: number): Promise<PollsDto> {
    let pollsArray = (await this.pollRepository.findAllByUserId(userId)).map((poll) => {
      return {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        createdBy: poll.creator!.name
      }
    })
    Logger.debug(`polls: ${JSON.stringify(pollsArray)}`)
    return { polls: pollsArray, totalPolls: pollsArray.length }
  }

}
