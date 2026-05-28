import { IsArray, IsNumber, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class PollsItemDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id!: number;

    @ApiProperty({ example: 'Favourite season' })
    @IsString()
    title!: string;

    @ApiProperty({ example: 'Vote for your favourite season' })
    @IsString()
    description!: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    createdBy: string;
}

export class PollsDto {
    @ApiProperty({ type: [PollsItemDto] })
    @IsArray()
    polls: PollsItemDto[]

    @ApiProperty({ example: 5 })
    @IsNumber()
    totalPolls: number;
}