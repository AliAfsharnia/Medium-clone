import { Body, Controller, Get, Post, Put, Req, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import { UserService } from './user.service'; 
import { CreateUserDTO } from './DTO/creatuser.dto';
import { UserResponsIntereface } from './type/createUser.interface';
import { LoginUserDTO } from './DTO/newuser.dto';
import { UserEntity } from './user.entity';
import { User } from './decoratores/user.decorator';
import { AuthGuard } from './Guards/auth.guard';
import { UpdateUserDTO } from './DTO/updateuser.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller()
export class UserController {
    constructor(private readonly userService: UserService){};

    @Post('users')
    @ApiBody({
        type:  [CreateUserDTO],
        description: 'Json structure for user object',
    })
    @UsePipes(new ValidationPipe())
    async createUser(@Body() createUserDTO:CreateUserDTO):Promise<UserResponsIntereface>{
        const user = await this.userService.createUser(createUserDTO);
        return this.userService.buildUserResponse(user);
    }


    @Post("users/login")
    @ApiBody({
        type: LoginUserDTO,
        description: 'Json structure for user object',
    })
    @UsePipes(new ValidationPipe())
    async loginUser(@Body() loginUserDTO: LoginUserDTO): Promise<UserResponsIntereface>{
        const user = await this.userService.loginRequest(loginUserDTO);
        return this.userService.buildUserResponse(user);
    }

    @ApiBearerAuth()
    @Get('user')
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<UserResponsIntereface>{
       return this.userService.buildUserResponse(user);
    }

    @ApiBearerAuth()
    @Put('user')
    @ApiBody({
        type: UpdateUserDTO,
        description: 'Json structure for user object',
    })
    @UseGuards(AuthGuard)
    async updateCurrentUser(@User('id') currentUserId: number, @Body() updateUserDTO:UpdateUserDTO): Promise<UserResponsIntereface>{
        const user = await this.userService.updateUser(currentUserId, updateUserDTO);
        return this.userService.buildUserResponse(user);
    }
}
