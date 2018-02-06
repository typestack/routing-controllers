import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, MaxLength, MinLength} from "class-validator";
import {Album} from "./Album";
import {User} from "../../user/entity/User";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @MaxLength(250)
    filename: string;

    @Column()
    @MinLength(5)
    @MaxLength(50)
    name: string;

    @Column("text")
    @MaxLength(500)
    description: string;

    @ManyToOne(() => Album, album => album.photos, { nullable: false })
    album: Album;

    @ManyToOne(() => User, { nullable: false })
    author: User;

}