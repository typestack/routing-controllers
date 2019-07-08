import {Photo} from './Photo';
import {Exclude, Type} from 'class-transformer';

export class User {

    public id: number;

    public name: string;

    @Exclude()
    public password: string;

    @Type(() => Photo)
    public photo: Photo;

}
