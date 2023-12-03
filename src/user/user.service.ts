import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schemas/user.schema'
import { Query } from 'express-serve-static-core';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private jwtService: JwtService
    ) { }

    // query used to filter out the results. its optional
    async findAll(query: Query): Promise<User[]> {

        const resPerPage = 2;
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const keyword = query.keyword ? {
            name: {
                $regex:query.keyword,
                $options: 'i'
            }
        } : {}
        const users = await this.userModel.find({...keyword}).limit(resPerPage).skip(skip)  
        return users;
    }

    async create(signUpDto: CreateUserDto): Promise<{ token: string}>{
        const { name, email, password, type } = signUpDto

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            type,
        })

        const token = this.jwtService.sign({id: user._id})

        return { token }
    }

    async findById(id: string): Promise<User> {

        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId){
            throw new BadRequestException("Incorrect ID");
        }

        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException("User not Found!");
        }
        return user;
    }

    async updateById(id: string, user: User): Promise<User> {
        return await this.userModel.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true,
        });
    }

    async deleteById(id: string): Promise<User> {
        return await this.userModel.findByIdAndDelete(id);
    }
}
