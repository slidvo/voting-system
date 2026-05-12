import { Inject, Injectable } from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollRepository } from './poll.repository';
//TODO: add repositories and services for options and answers
@Injectable()
export class PollService {

  constructor(
    private readonly pollRepository: PollRepository
  ) { }

  create(createPollDto: CreatePollDto) {
    return this.pollRepository.create(createPollDto);
  }

  findAll() {
    return this.pollRepository.findAll();
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
