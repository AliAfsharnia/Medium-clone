import { ApiProperty } from "@nestjs/swagger";

export class UpdateArticleDTO{
    @ApiProperty({
        example: 'our little lies',
        required: true
     })
    readonly title: string;
 
    @ApiProperty({
        example: 'book for grown mans',
        required: false
     })
    readonly description: string;

    @ApiProperty({
        example: 'body',
        required: false
     })
    readonly body: string;

    @ApiProperty({
        example: 'story, study',
        required: false
     })
    readonly tagList?: string[];
}