import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDTO{

     @ApiProperty({
          example: 'user1@gmail.com',
          required: true
       })
     @IsNotEmpty()
     @IsEmail()
     readonly email: string;

     @ApiProperty({
          example: '123',
          required: true
       })
     @IsNotEmpty()
     readonly password: string;
}