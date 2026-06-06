import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedDatabase } from './database/seed';
import { User } from './entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Seed de base de datos (ejecutar si la BD está vacía o en desarrollo)
  const dataSource = app.get(DataSource);
  try {
    const userCount = await dataSource.getRepository(User).count();
    if (userCount === 0) {
      console.log('📦 Base de datos vacía, ejecutando seed...');
      await seedDatabase(dataSource);
      console.log('✅ Seed completado');
    }
  } catch (error: any) {
    console.log('⚠️ Error al verificar/ejecutar seed:', error.message);
    // En desarrollo, ejecutar seed de todas formas
    if (process.env.NODE_ENV !== 'production') {
      await seedDatabase(dataSource);
    }
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
