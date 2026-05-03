import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HelloCrudService } from './hello-crud.service';
import { CreateHelloCrudDto } from './dto/create-hello-crud.dto';
import { UpdateHelloCrudDto } from './dto/update-hello-crud.dto';

@Controller('hello-crud')
export class HelloCrudController {
  constructor(private readonly helloCrudService: HelloCrudService) {}

  @Post()
  create(@Body() createHelloCrudDto: CreateHelloCrudDto) {
    return this.helloCrudService.create(createHelloCrudDto);
  }

  @Get()
  findAll() {
    return this.helloCrudService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.helloCrudService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHelloCrudDto: UpdateHelloCrudDto) {
    return this.helloCrudService.update(+id, updateHelloCrudDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.helloCrudService.remove(+id);
  }
}
