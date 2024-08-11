import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateArticleDTO{
    @ApiProperty({
        example: 'our little lies',
        required: true
     })
    @IsNotEmpty()
    readonly title: string;
    
    @ApiProperty({
        example: 'book for grown mans',
        required: false
     })
    @IsNotEmpty()
    readonly description: string;

    @ApiProperty({
        example: 'body',
        required: false
     })
    @IsNotEmpty()
    readonly body: string;

    @ApiProperty({
        example: 'story, study',
        required: false
     })
    readonly tagList?: string[];
}