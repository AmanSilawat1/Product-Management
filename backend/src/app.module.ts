import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { Product } from './products/products.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE as any || 'sqlite',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE || 'db.sqlite',
            entities: [User, Product],
            synchronize: true,
        }),
        UsersModule,
        ProductsModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }