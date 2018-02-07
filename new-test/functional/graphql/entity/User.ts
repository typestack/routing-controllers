import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Photo} from "./Photo";
import {Role} from "../model/Role";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @OneToMany(type => Photo, photo => photo.author)
    photos: Photo[];

    name: string;
    fullName: string;
    roles: Role[];

    constructor(firstName?: string, lastName?: string, photos?: Photo[], roles?: Role[]) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.photos = photos;
        this.roles = roles;
    }

}