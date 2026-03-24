import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseResponse {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}

export class IntBaseResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
