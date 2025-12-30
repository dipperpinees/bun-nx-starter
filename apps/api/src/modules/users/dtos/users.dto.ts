import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'User name', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'User email', example: 'john@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional({ description: 'User password', example: 'secret123' })
    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;
}

export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'User name', example: 'John Doe' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'User email', example: 'john@example.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ description: 'User password', example: 'secret123' })
    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;
}
