import { PartialType } from '@nestjs/mapped-types';
import { CreateHelloCrudDto } from './create-hello-crud.dto';

export class UpdateHelloCrudDto extends PartialType(CreateHelloCrudDto) {}
