import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FormsModule } from './forms/forms.module';
import { ResponsesModule } from './responses/responses.module';
import { ProgressModule } from './progress/progress.module';
import { AdminModule } from './admin/admin.module';
import { User } from './entities/user.entity';
import { Form } from './entities/form.entity';
import { UserResponse } from './entities/user-response.entity';
import { UserProgress } from './entities/user-progress.entity';
import { ensureDataDirectory } from './utils/ensure-data-dir';

// Asegurar que el directorio de datos existe antes de inicializar TypeORM
const databasePath = process.env.DATABASE_PATH || './database.sqlite';
ensureDataDirectory(databasePath);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: databasePath,
      entities: [User, Form, UserResponse, UserProgress],
      synchronize: true, // Habilitado para crear tablas automáticamente
      logging: process.env.NODE_ENV === 'development',
      migrations: [],
    }),
    AuthModule,
    UsersModule,
    FormsModule,
    ResponsesModule,
    ProgressModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
