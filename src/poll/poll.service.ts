import { Injectable, Logger } from '@nestjs/common'
import { CreatePollDto } from './dto/create-poll.dto'
import { UpdatePollDto } from './dto/update-poll.dto'
import { PollRepository } from './poll.repository'
import { PollsDto } from './dto/polls.dto'
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

  findOne(id: number) {
    return `This action returns a #${id} poll`;
  }

  update(id: number, updatePollDto: UpdatePollDto) {
    return `This action updates a #${id} poll`;
  }

  remove(id: number) {
    return `This action removes a #${id} poll`;
  }
}
