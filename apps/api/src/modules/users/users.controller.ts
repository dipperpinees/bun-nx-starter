import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransformApiResponse } from '@shared/decorators/transform-api-response.decorator';
import { OkResponse } from '@shared/responses/ok.response';
import { ApiSuccessResponse } from '@shared/responses/swagger';
import { CreateUserDto, UpdateUserDto } from './dtos/users.dto';
import { UserListResponse, UserResponse } from './responses/user.response';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiSuccessResponse(UserListResponse)
    @TransformApiResponse(UserListResponse)
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiSuccessResponse(UserResponse)
    @TransformApiResponse(UserResponse)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiSuccessResponse(UserResponse)
    @TransformApiResponse(UserResponse)
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiSuccessResponse(UserResponse)
    @TransformApiResponse(UserResponse)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiSuccessResponse(OkResponse)
    @TransformApiResponse(UserResponse)
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.usersService.delete(id);
        return {
            ok: true
        }
    }
}
