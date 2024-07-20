import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import User from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    const users = await this.userService.getAllUsers();
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.getUserById(id);
    return user;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);
    return newUser;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<User> {
    const user = this.userService.deleteById(id);
    return user;
  }
}
