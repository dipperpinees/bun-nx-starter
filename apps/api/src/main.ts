import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './modules/app/app.module';
import { AllExceptionsFilter } from '@shared/filters/http-exception.filter';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Bun NX API')
    .setDescription('API documentation for Bun NX project')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Scalar API Reference (modern UI)
  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'kepler',
      withFastify: true,
    }),
  );

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalFilters(app.get(AllExceptionsFilter));

  // Expose raw OpenAPI JSON
  app.getHttpAdapter().get('/api/openapi', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(document);
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  logger.log(`📚 API Docs (Scalar): http://localhost:${port}/docs`);
  logger.log(`📋 OpenAPI JSON: http://localhost:${port}/api/openapi`);
}

bootstrap();
