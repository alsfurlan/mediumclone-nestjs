import { UserEntity } from '@app/user/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileResponseInterface } from './types/profile-response.interface';
import { ProfileType } from './types/profile.type';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  buildProfileResponse(profileType: ProfileType): ProfileResponseInterface {
    const { email, ...profile } = profileType;
    return { profile };
  }

  async getProfile(userId: number, username: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username,
    });
    if (!user) {
      throw new NotFoundException('Profile does not exist');
    }
    return { ...user, following: false };
  }
}
