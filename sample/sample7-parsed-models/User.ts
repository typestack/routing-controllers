import {Photo} from "./Photo";
import {Type, Skip} from "constructor-utils/constructor-utils";

export class User {
    
    id: number;
    
    name: string;

    @Skip()
    password: string;
    
    @Type(() => Photo)
    photo: Photo;
    
}