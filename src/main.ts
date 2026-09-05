import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { EnvService } from './env/services/env';
import { JWT_AUTH } from './authentication/infrastructure/nest/decorators/auth.decorator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = app.get(EnvService);
  const swaggerEnabled = env.NODE_ENV !== 'production' || env.SWAGGER_ENABLED;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({ origin: '*' });

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Clear Accounts API')
      .setDescription('Cuentas compartidas, membresías y finanzas personales')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          description: 'Token de acceso devuelto por el login',
        },
        JWT_AUTH,
      )
      .build();

    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config), {
      jsonDocumentUrl: 'api/json',
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  await app.listen(env.PORT);

  const logger = new Logger('Bootstrap');
  logger.log(`Server running on http://localhost:${env.PORT}`);

  if (swaggerEnabled) {
    logger.log(`Swagger documentation at http://localhost:${env.PORT}/api`);
  }
}

void bootstrap();
