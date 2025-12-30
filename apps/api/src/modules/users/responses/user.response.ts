import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserResponse {
    @Expose()
    @ApiProperty({ description: 'User ID', example: 1 })
    id: number;

    @Expose()
    @ApiProperty({ description: 'User name', example: 'John Doe' })
    name: string;

    @Expose()
    @ApiProperty({ description: 'User email', example: 'john@example.com' })
    email: string;

    @Expose()
    @ApiProperty({ description: 'Created timestamp', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;

    @Expose()
    @ApiProperty({ description: 'Updated timestamp', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date;
}

export class UserListResponse {
    @ApiProperty({ type: [UserResponse] })
    @Type(() => UserResponse)
    items: UserResponse[]
}