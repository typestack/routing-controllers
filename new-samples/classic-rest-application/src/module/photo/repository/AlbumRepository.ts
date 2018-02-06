import {EntityRepository, Repository} from "typeorm";
import {Album} from "../entity/Album";
import {AlbumListRequest} from "../request/AlbumListRequest";

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {

    findByListRequest(request: AlbumListRequest) {
        const qb = this.createQueryBuilder("album");

        if (request.withPhotos)
            qb.leftJoinAndSelect("album.photos", "photo");

        if (request.offset)
            qb.skip(request.offset);

        if (request.limit)
            qb.take(request.limit);

        return qb.getMany();
    }

}