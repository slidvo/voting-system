import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { PollRepository } from './poll.repository';
import { pollProviders } from './poll.providers';
import { DatabaseModule } from '@src/database/database.module';
import { AnswerRepository } from './answer.repository';
import { PollGateway } from './poll.gateway';

@Module({
  imports: [DatabaseModule],
  controllers: [PollController],
  providers: [PollService, ...pollProviders, PollRepository, AnswerRepository, PollGateway],
  exports: [...pollProviders]
})
export class PollModule { }
