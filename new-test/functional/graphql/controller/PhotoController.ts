import {GraphController} from "../../../../src/decorator/GraphController";
import {Query} from "../../../../src/decorator/Query";
import {EntityManager} from "typeorm";
import {Photo} from "../entity/Photo";
import {PhotosArgs} from "../args/PhotosArgs";

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

}