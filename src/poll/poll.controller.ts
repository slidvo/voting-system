import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Logger } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Permissions } from '@src/common/permissions.decorator';
import { Permission } from '@src/common/enums/permissions.enum';
import { PermissionsGuard } from '@src/common/guards/permissions.guard';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { AnswersDto } from './dto/answers.dto';

@Controller('poll')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PollController {
  constructor(private readonly pollService: PollService) { }

  @Post()
  @Permissions(Permission.CREATE_POLL)
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollService.create(createPollDto);
  }

  @Get()
  @Permissions(Permission.WATCH_POLL)
  findAll() {
    return this.pollService.findAll();
  }

  @Get(':id')
  @Permissions(Permission.WATCH_POLL)
  findOne(@Param('id') id: string) {
    return this.pollService.findOne(+id);
  }

  @Post(':id/answers')
  @Permissions(Permission.CREATE_POLL)
  savePollAnswers(@Param('id') pollId: string, @Body() rqBody: AnswersDto, @Request() req) {
    Logger.debug(`req.user: ${JSON.stringify(req.user)}`);
    const userId = req.user.userId;
    Logger.debug(`Saving answers for poll ${pollId} by user ${userId}`);
    return this.pollService.savePollAnswers({
      pollId: +pollId,
      userId: +userId,
      options: rqBody.answers.map(a => a.optionId)
    });
  }

  @Patch(':id')
  @Permissions(Permission.UPDATE_POLL)
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollService.update(+id, updatePollDto);
  }

  @Delete(':id')
  @Permissions(Permission.DELETE_POLL)
  remove(@Param('id') id: string) {
    return this.pollService.remove(+id);
  }
}
