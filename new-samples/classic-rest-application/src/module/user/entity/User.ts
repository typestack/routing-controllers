import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {MaxLength, MinLength} from "class-validator";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(5)
    @MaxLength(50)
    firstName: string;

    @Column()
    @MinLength(5)
    @MaxLength(50)
    lastName: string;

    @Column({ select: false })
    @MinLength(10)
    @MaxLength(50)
    password: string;

}