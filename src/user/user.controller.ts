
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';

@Controller('user')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.userService.findOne(id);
    }

    @Get('/by-name/:name')
    async findOneByName(@Param('name') name: string) {
        return await this.userService.findOneByName(name);
    }

    @Get('/by-email/:email')
    async findOneByEmail(@Param('email') email: string) {
        return await this.userService.findOneByEmail(email);
    }

    @Post()
    async create(@Body() userDto: UserDto) {
        const user: UserEntity = plainToInstance(UserEntity, userDto);

        return await this.userService.create(user);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() userDto: UserDto) {
        const user: UserEntity = plainToInstance(UserEntity, userDto);
        return await this.userService.update(id, user);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.userService.delete(id);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req);
    }
}
