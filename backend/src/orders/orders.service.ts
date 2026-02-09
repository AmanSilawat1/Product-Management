import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
    constructor(@InjectRepository(Order) private repo: Repository<Order>) { }

    create() {
        const order = this.repo.create();
        return this.repo.save(order);
    }
}
