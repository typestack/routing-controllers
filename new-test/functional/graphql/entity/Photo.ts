import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {Album} from "./Album";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @ManyToOne(type => User, photo => photo.photos)
    author: User;

    @ManyToMany(type => Album)
    @JoinTable()
    albums: Album[];

    constructor(filename?: string, author?: User, albums?: Album[]) {
        this.filename = filename;
        this.author = author;
        this.albums = albums;
    }

}