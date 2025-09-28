/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from 'src/auth/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }
    async createUser(registerUserDto: RegisterUserDto) {

        try {
            return await this.userModel.create({
                fname: registerUserDto.fname,
                lname: registerUserDto.lname,
                email: registerUserDto.email,
                password: registerUserDto.password,
                role: registerUserDto.role ?? undefined,
            });
        } catch (err: unknown) {
            const e = err as { code?: number };
            const DUP_KEY_ERROR_CODE = 11000;

            if (e.code === DUP_KEY_ERROR_CODE) {
                throw new ConflictException('Email already exists');
            }
            throw err;
        }
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email }).exec();
    }

    async findById(id: string) {
        return await this.userModel.findById(id).exec();
    }
}
