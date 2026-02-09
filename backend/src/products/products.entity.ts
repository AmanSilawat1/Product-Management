import { AfterInsert, AfterRemove, AfterUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "../orders/order.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    // order id - required: reference to order.
    @ManyToOne(() => Order, (order) => order.products)
    order: Order;

    // title - required (non-empty product title)
    @Column()
    title: string;

    // description will be optional. 
    @Column({ nullable: true })
    description: string;

    // quantity - required (non-negative quantity)
    @Column()
    quantity: number;

    // total price - required (non-negative Decimal)
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    // total discount - required (non-negative Decimal >= 0 and <= totalPrice)
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalDiscount: number;

    // createdAt
    // createdAt
    @CreateDateColumn()
    createdAt: Date;

    // updatedAt
    @UpdateDateColumn()
    updatedAt: Date;

    // deleted at: Soft delete timestamp or null
    @DeleteDateColumn()
    deletedAt: Date;

    @AfterInsert()
    logInsert() {
        console.log("Inserted Product: ", this.id)
    }

    @AfterUpdate()
    logUpdate() {
        console.log("Updated Product: ", this.id)
    }

    @AfterRemove()
    logRemove() {
        console.log("Removed Product: ", this.id)
    }
}