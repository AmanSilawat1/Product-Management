import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pm_user',
      password: 'pm_password',
      database: 'pm_db',
      autoLoadEntities: true,
      synchronize: true, // ONLY FOR LEARNING
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
