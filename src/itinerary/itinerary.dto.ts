

import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ItineraryDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    budget: number;

    @IsString()
    @IsNotEmpty()
    destination: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    endDate: Date;

    @IsArray()
    @IsNotEmpty()
    preferences: string[];

    @IsString()
    @IsNotEmpty()
    transport: string;
}
