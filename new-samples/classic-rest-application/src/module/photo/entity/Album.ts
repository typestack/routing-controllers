import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {MaxLength, MinLength} from "class-validator";
import {Photo} from "./Photo";

@Entity()
export class Album {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(5)
    @MaxLength(50)
    name: string;

    @OneToMany(() => Photo, photo => photo.album)
    photos: Photo[];

}