import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ProfileType } from './type/profile.type';
import { ProfileResponseInterface } from './type/profileResponse.interface';
import { FollowEntity } from './profile.entity';

@Injectable()
export class ProfileService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>, @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity> ){}

    async getProfile(currentUserId: number,profileUsername: string):Promise<ProfileType>{
        const profile = await this.userRepository.findOne({where:{username: profileUsername}})
        if(!profile){
            throw new HttpException('this username doesnt exist', HttpStatus.NOT_FOUND);
        }

        var following = false;

        if(currentUserId){
            const isFollowed = await this.followRepository.findOne({where:{followerId: currentUserId, followingId: profile.id}})
            console.log(isFollowed);
            if(isFollowed){
                console.log(isFollowed);
                following = true;
            }
        }

        return {...profile ,following};
    }

    async followUser(currentUserId: number,profileUsername: string):Promise<ProfileType>{
        const profile = await this.userRepository.findOne({where:{username: profileUsername}})
        if(!profile){
            throw new HttpException('this username doesnt exist', HttpStatus.NOT_FOUND);
        }

        if(currentUserId === profile.id){
            throw new HttpException('follower and following cant be same!', HttpStatus.BAD_REQUEST);
        }

        const follow = await this.followRepository.findOne({where: {followerId : currentUserId, followingId: profile.id}})

        if(!follow){
            const following = new FollowEntity;
            following.followerId = currentUserId;
            following.followingId = profile.id;

            await this.followRepository.save(following)
        }
        return {...profile ,following: true};
    }

    async unfollowUser(currentUserId: number,profileUsername: string):Promise<ProfileType>{
        const profile = await this.userRepository.findOne({where:{username: profileUsername}})
        if(!profile){
            throw new HttpException('this username doesnt exist', HttpStatus.NOT_FOUND);
        }

        if(currentUserId === profile.id){
            throw new HttpException('follower and following cant be same!', HttpStatus.BAD_REQUEST);
        }

        const follow = await this.followRepository.findOne({where: {followerId : currentUserId, followingId: profile.id}})

        if(follow){
            await this.followRepository.delete(follow)
        }
        return {...profile ,following: false};
    }


    createProfileResponse(profile: ProfileType):ProfileResponseInterface{
        delete profile.email;
        return {profile}
    }
}
