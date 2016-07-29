import {Photo} from "./Photo";
import {Type, Exclude} from "class-transformer";

export class User {
    
    id: number;
    
    name: string;

    @Exclude()
    password: string;
    
    @Type(() => Photo)
    photo: Photo;
    
}