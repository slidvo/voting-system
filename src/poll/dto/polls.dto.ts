import { IsArray, IsNumber, IsString } from "class-validator"

export class PollsDto {
    @IsArray()
    polls: PollDto[]
}

class PollDto {
    @IsNumber()
    id!: number;
    @IsString()
    title!: string;
    @IsString()
    description!: string;
}