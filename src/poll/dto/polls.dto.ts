import { IsArray, IsNumber, IsString } from "class-validator"

export class PollsDto {
    @IsArray()
    polls: PollsItemDto[]

    @IsNumber()
    totalPolls: number;
}

class PollsItemDto {
    @IsNumber()
    id!: number;
    @IsString()
    title!: string;
    @IsString()
    description!: string;
    @IsString()
    createdBy: string;
}