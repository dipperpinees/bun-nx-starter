import { ApiProperty } from '@nestjs/swagger';

export class AppApiSuccessResponse<TData> {
  data: TData | undefined;

  @ApiProperty({ type: 'string' })
  message? = 'success';
}
