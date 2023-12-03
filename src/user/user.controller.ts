import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('all')
    @UseGuards(AuthGuard())
    async getAllUsers(
        @Query() query: ExpressQuery, 
        @Req() req
    ): Promise<User[]> {
        console.log(req.user);
        if (req.user.type !== "admin"){
            throw new UnauthorizedException("You don't have access")
        }
        return this.userService.findAll(query);
    }

    @Post('signup')
    @UseGuards(AuthGuard())
    async createUser(
        @Body()
        user: CreateUserDto,
        @Req() req
    ): Promise<{token: string}> {
        console.log(req.user);
        if (req.user.type !== "admin"){
            throw new UnauthorizedException("You don't have access")
        }
        return this.userService.create(user);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async getUser(
        @Param ('id')
        id: string,
        @Req() req
    ): Promise<User> {
        if(req.user.type !== 'admin' || req.user.id !== id){
            throw new UnauthorizedException("You don't have access.")
        }
        return this.userService.findById(id);
    }

    @Put('update/:id')
    @UseGuards(AuthGuard())
    async updateUser(
        @Param('id')
        id: string,

        @Body()
        user: UpdateUserDto,
        @Req() req
    ): Promise<User> {
        console.log(req.user);
        if (req.user.type !== "admin" || req.user.id !== id){
            throw new UnauthorizedException("You don't have access")
        }
        return this.userService.updateById(id, user);
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard())
    async deleteUser(
        @Param ('id')
        id: string,
        @Req() req
    ): Promise<User> {
        console.log(req.user);
        if (req.user.type !== "admin" || req.user.id !== id){
            throw new UnauthorizedException("You don't have access")
        }
        return this.userService.deleteById(id);
    }
}
