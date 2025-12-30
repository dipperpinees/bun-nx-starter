import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PaginationMeta {
  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty({ name: 'total_pages' })
  @Expose({ name: 'total_pages' })
  totalPages: number;

  @ApiPropertyOptional()
  @Expose()
  page?: number;

  @ApiPropertyOptional()
  @Expose()
  limit?: number;
}

export class CursorPaginationMeta {
  @ApiPropertyOptional()
  @Expose()
  cursor?: string;

  @ApiPropertyOptional({ name: 'has_next_page' })
  @Expose({ name: 'has_next_page' })
  hasNextPage?: boolean;
}

export class PaginationResponse {
  @ApiProperty({ type: PaginationMeta })
  @Expose()
  @Type(() => PaginationMeta)
  pagination: PaginationMeta;
}

export class CursorPaginationResponse {
  @ApiProperty({ type: CursorPaginationMeta })
  @Expose()
  @Type(() => CursorPaginationMeta)
  pagination: CursorPaginationMeta;
}
