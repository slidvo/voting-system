import { Injectable } from '@nestjs/common';
import { CreateHelloCrudDto } from './dto/create-hello-crud.dto';
import { UpdateHelloCrudDto } from './dto/update-hello-crud.dto';

@Injectable()
export class HelloCrudService {
  create(createHelloCrudDto: CreateHelloCrudDto) {
    return 'This action adds a new helloCrud';
  }

  findAll() {
    return `This action returns all helloCrud`;
  }

  findOne(id: number) {
    return `This action returns a #${id} helloCrud`;
  }

  update(id: number, updateHelloCrudDto: UpdateHelloCrudDto) {
    return `This action updates a #${id} helloCrud`;
  }

  remove(id: number) {
    return `This action removes a #${id} helloCrud`;
  }
}
