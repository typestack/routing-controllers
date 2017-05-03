import {Photo} from "./Photo";
import {Exclude, Type} from "class-transformer";

export class User {
    
    id: number;
    
    name: string;

    @Exclude()
    password: string;
    
    @Type(() => Photo)
    photo: Photo;
    
}