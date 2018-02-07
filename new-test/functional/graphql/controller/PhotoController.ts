import {GraphController} from "../../../../src/decorator/GraphController";
import {Query} from "../../../../src/decorator/Query";
import {EntityManager} from "typeorm";
import {Photo} from "../entity/Photo";
import {PhotosArgs} from "../args/PhotosArgs";
import {Mutation} from "../../../../src/decorator/Mutation";
import {PhotoInput} from "../model/PhotoInput";

@GraphController()
export class PhotoController {

    constructor(private entityManager: EntityManager) {
    }

    @Query()
    photos(args: PhotosArgs) {
        return this.entityManager.find(Photo, { take: args.limit, skip: args.offset });
    }

    @Query()
    async photoCollection() {
        const [photos, count] = await this.entityManager.findAndCount(Photo);
        return {photos, count};
    }

    @Query()
    photo(args: { id: number }) {
        return this.entityManager.findOne(Photo, args.id);
    }

    @Mutation()
    async savePhoto({ photoInput }: { photoInput: PhotoInput }) {
        let photo = new Photo();
        if (photoInput.id) {
            photo = await this.entityManager.findOne(Photo, photoInput.id);
        }
        photo.filename = photoInput.filename;
        await this.entityManager.save(photo);
        return photo;
    }

}