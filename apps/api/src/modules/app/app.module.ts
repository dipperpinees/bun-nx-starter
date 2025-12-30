import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from '../users/users.module';
import { AllExceptionsFilter } from '@shared/filters/http-exception.filter';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                singleLine: true,
              },
            }
            : undefined,
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
        customLogLevel: function (req, res, err) {
          if (res && res.statusCode && res.statusCode >= 400) return 'silent';
          return 'info';
        },
        customProps: (req: any, res) => ({
          user: req.user?.id,
        }),
      },
    }),
    UsersModule
  ],
  controllers: [],
  providers: [AllExceptionsFilter],
})
export class AppModule { }

