import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OptionDto {
    @ApiProperty({ example: 'Option A' })
    @IsString()
    text: string;
}