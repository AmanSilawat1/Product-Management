import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    // order id - required: reference to order.
    @Column()
    orderId: number;

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
    @Column()
    totalPrice: number;

    // total discount - required (non-negative Decimal >= 0 and <= totalPrice)
    @Column()
    totalDiscount: number;

    // createdAt
    @Column()
    createdAt: Date;

    // updatedAt
    @Column()
    updatedAt: Date;

    // deleted at: Soft delete timestamp or null
    @Column({ nullable: true })
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