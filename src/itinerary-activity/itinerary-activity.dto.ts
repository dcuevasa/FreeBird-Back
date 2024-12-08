

import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class ItineraryActivityDto {

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    date: Date;
    
    @IsString()
    @IsNotEmpty()
    time: string;
}
