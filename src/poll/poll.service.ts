import { Injectable, Logger } from '@nestjs/common'
import { CreatePollDto } from './dto/create-poll.dto'
import { UpdatePollDto } from './dto/update-poll.dto'
import { PollRepository } from './poll.repository'
import { PollsDto } from './dto/polls.dto'
import { PollDto } from './dto/poll.dto'
@Injectable()
export class PollService {

  constructor(
    private readonly pollRepository: PollRepository
  ) { }

  create(createPollDto: CreatePollDto) {
    return this.pollRepository.create(createPollDto)
  }

  async findAll(): Promise<PollsDto> {
    let pollsArray = (await this.pollRepository.findAll()).map((poll) => {
      return {
        id: poll.id,
        title: poll.title,
        description: poll.description
      }
    })
    Logger.debug(`polls: ${JSON.stringify(pollsArray)}`)
    return { polls: pollsArray }
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

  update(id: number, updatePollDto: UpdatePollDto) {
    return `This action updates a #${id} poll`;
  }

  remove(id: number) {
    return `This action removes a #${id} poll`;
  }
}
