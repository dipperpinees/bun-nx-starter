import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { TransformApiResponseInterceptor } from '../interceptors/transform-api-response.interceptor';

export function TransformApiResponse(dto: any) {
  return applyDecorators(
    UseInterceptors(new TransformApiResponseInterceptor(dto))
  );
}
