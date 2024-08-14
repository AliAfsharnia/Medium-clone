import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class UpdateUserDTO{
     @ApiProperty({
          example: 'user2',
          required: false
       })
     readonly username: string;

     @ApiProperty({
          example: 'user1@gmail.com',
          required: false
       })
     @IsEmail()
     readonly email: string;

     @ApiProperty({
          example: 'bio',
          required: false
       })
     readonly bio: string;

     @ApiProperty({
          example: '',
          required: false
       })
     readonly image: string;
}