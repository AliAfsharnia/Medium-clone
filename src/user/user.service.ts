import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './DTO/creatuser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRETE } from 'src/config';
import { UserResponsIntereface } from './type/createUser.interface';
import { LoginUserDTO } from './DTO/newuser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDTO } from './DTO/updateuser.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity> ){}
    
    async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity>{

        
    const userByEmail = await this.userRepository.findOne({
        where:{email :createUserDTO.email}
    })

    const userByUsername = await this.userRepository.findOne({
        where:{username :createUserDTO.username}
    })

    console.log(userByEmail, userByUsername);

    if( userByEmail || userByUsername){
        throw new HttpException('email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }

        const newUser = new UserEntity();
        Object.assign(newUser, createUserDTO);
        
        return await this.userRepository.save(newUser);
    }

    async findById(userID: number): Promise<UserEntity>{
        return await this.userRepository.findOne({
            where: {id: userID}
        });
    }
    generateJwt(user: UserEntity): string{
        return sign({
            id: user.id,
            username:  user.username,
            email: user.email
        }, JWT_SECRETE)
    }

    buildUserResponse(user: UserEntity): UserResponsIntereface{
        return{
            user:{
                ...user,
                token: this.generateJwt(user)
            }
        }
    }

    async loginRequest(loginUserDTO: LoginUserDTO): Promise<UserEntity>{
        const userByEmail = await this.userRepository.findOne({
            where:{email :loginUserDTO.email} , select:["id", "username", "password", "image", "bio"]}
        )
        
        if (!userByEmail){
            throw new HttpException('email or password isnt correct!', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const isPasswordCorrect = await compare(loginUserDTO.password,  userByEmail.password);
    
        if (!isPasswordCorrect){
            throw new HttpException('email or password isnt correct!', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        delete userByEmail.password;
        return userByEmail;
    }

    async updateUser(id: number, updateUserDTO:UpdateUserDTO): Promise<UserEntity>{
        const user = await this.findById(id);
        Object.assign(user, updateUserDTO) ;
        return this.userRepository.save(user);
    }
}
