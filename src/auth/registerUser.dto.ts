/* eslint-disable prettier/prettier */
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Role } from 'src/user/user.type';

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    fname: string;
    @IsNotEmpty()
    @IsString()
    lname: string;
    @IsNotEmpty()
    @IsEmail()
    email: string
    password: string;
    @IsOptional()
    @IsIn([Role.Admin, Role.student])
    role?: Role;
}