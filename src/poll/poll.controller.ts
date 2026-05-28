import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Permissions } from '@src/common/permissions.decorator';
import { Permission } from '@src/common/enums/permissions.enum';
import { PermissionsGuard } from '@src/common/guards/permissions.guard';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { AnswersDto } from './dto/answers.dto';
import { PollsDto } from './dto/polls.dto';
import { PollDto } from './dto/poll.dto';

@ApiTags('poll')
@ApiBearerAuth()
@Controller('poll')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PollController {
  constructor(private readonly pollService: PollService) { }

  @Post()
  @Permissions(Permission.CREATE_POLL)
  @ApiOperation({ summary: 'Create a new poll' })
  @ApiBody({ type: CreatePollDto })
  @ApiResponse({ status: 201, description: 'Poll created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollService.create(createPollDto);
  }

  @Get()
  @Permissions(Permission.WATCH_POLL)
  @ApiOperation({ summary: 'Get all active polls' })
  @ApiResponse({ status: 200, description: 'List of polls', type: PollsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.pollService.findAll();
  }

  @Get('my')
  @Permissions(Permission.WATCH_POLL)
  @ApiOperation({ summary: 'Get polls created by the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user polls', type: PollsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllByUserId(@Request() req) {
    return this.pollService.findAllByUserId(req.user.userId);
  }

  @Get(':id')
  @Permissions(Permission.WATCH_POLL)
  @ApiOperation({ summary: 'Get a poll by ID with questions and options' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Poll details', type: PollDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  findOne(@Param('id') id: string) {
    return this.pollService.findOne(+id);
  }

  @Post(':id/answers')
  @Permissions(Permission.CREATE_POLL)
  @ApiOperation({ summary: 'Submit answers for a poll' })
  @ApiParam({ name: 'id', type: Number, description: 'Poll ID' })
  @ApiBody({ type: AnswersDto })
  @ApiResponse({ status: 201, description: 'Answers saved successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'User has already answered this poll' })
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
  @Permissions(Permission.CREATE_POLL)
  @ApiOperation({ summary: 'Update a poll (owner only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePollDto })
  @ApiResponse({ status: 200, description: 'Poll updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Poll not found or access denied' })
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto, @Request() req) {
    return this.pollService.update(+id, updatePollDto, req.user.userId);
  }

  @Delete(':id')
  @Permissions(Permission.DELETE_POLL)
  @ApiOperation({ summary: 'Delete a poll by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Poll deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.pollService.remove(+id);
  }
}
