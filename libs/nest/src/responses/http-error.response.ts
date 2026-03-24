import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Validation failed' })
  message: string;

  @ApiProperty({
    example: ['email must be an email', 'password should not be empty'],
    required: false,
    type: [String],
  })
  errors?: string[];

  @ApiProperty({
    example: '2025-05-23T14:33:12.123Z',
  })
  timestamp: string;

  @ApiProperty({
    example: '/auth/login',
  })
  path: string;
}
