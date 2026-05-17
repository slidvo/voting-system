import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Permissions } from '@src/common/permissions.decorator';
import { Permission } from '@src/common/enums/permissions.enum';
import { PermissionsGuard } from '@src/common/guards/permissions.guard';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) { }

  @Post()
  @Permissions(Permission.CREATE_POLL)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollService.create(createPollDto);
  }

  @Get()
  findAll() {
    return this.pollService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollService.update(+id, updatePollDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollService.remove(+id);
  }
}
