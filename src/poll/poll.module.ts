import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { PollRepository } from './poll.repository';
import { pollProviders } from './poll.providers';
import { DatabaseModule } from '@src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PollController],
  providers: [PollService, ...pollProviders, PollRepository],
  exports: [...pollProviders]
})
export class PollModule { }
