/* eslint-disable */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformApiResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly dto: any) {}

  convertPlain(data: any) {
    const instance = plainToInstance(this.dto, data, {
      excludeExtraneousValues: true,
      ignoreDecorators: true,
    });

    return instanceToPlain(instance, {
      excludeExtraneousValues: true,
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!this.dto || !data) return data;
        const message = 'Success';
        if (Array.isArray(data)) {
          return {
            data: data.map((item) => this.convertPlain(item)),
            message,
          };
        }

        return {
          data: this.convertPlain(data),
          message,
        };
      })
    );
  }
}
