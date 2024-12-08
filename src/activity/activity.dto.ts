
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ActivityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    durationMins: number;

    @IsArray()
    @IsNotEmpty()
    addressess: string[];
}
