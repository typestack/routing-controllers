import {EntityRepository, Repository} from "typeorm";
import {Photo} from "../entity/Photo";
import {PhotoListRequest} from "../request/PhotoListRequest";

@EntityRepository(Photo)
export class PhotoRepository extends Repository<Photo> {

    findByListRequest(request: PhotoListRequest) {
        const qb = this.createQueryBuilder("photo")
            .leftJoinAndSelect("photo.author", "author")
            .leftJoinAndSelect("photo.album", "album");

        if (request.keyword)
            qb.where("photo.name LIKE :keyword", { keyword: request.keyword });

        if (request.offset)
            qb.skip(request.offset);

        if (request.limit)
            qb.take(request.limit);

        return qb.getMany();
    }

}