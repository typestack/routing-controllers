import {Body, Delete, ForbiddenError, Get, JsonController, Param, Post, Put} from "../../../../../../src/index";
import {Transaction} from "typeorm";
import {PhotoRepository} from "../repository/PhotoRepository";
import {Photo} from "../entity/Photo";
import {CurrentUser} from "../../user/model/CurrentUser";
import {PhotoAccessDeniedError} from "../error/PhotoAccessDeniedError";
import {PhotoListRequest} from "../request/PhotoListRequest";
import {Authorized} from "../../../../../../src";

@JsonController()
export class PhotoController {

    constructor(private photoRepository: PhotoRepository,
                private currentUser?: CurrentUser) {
    }

    @Get("/photos")
    all(request: PhotoListRequest) {
        return this.photoRepository.findByListRequest(request);
    }

    @Get("/photos/:id")
    one(@Param("id") id: number) {
        return this.photoRepository.findOne(id, { relations: ["album", "author"] });
    }

    @Authorized()
    @Transaction()
    @Post("/photos")
    insert(@Body() photo: Photo) {

        // set photo author and save a photo
        photo.author = this.currentUser.user;
        return this.photoRepository.save(photo);
    }

    @Authorized()
    @Transaction()
    @Put("/photos/:id")
    async update(@Param("id") id: number, @Body() photo: Photo) {

        // check if user is author of the updated photo
        const existPhoto = await this.photoRepository.findOne(id, { relations: ["author"] });
        if (existPhoto.author.id !== this.currentUser.id)
            throw new PhotoAccessDeniedError();

        // perform updation
        return this.photoRepository.save(photo);
    }

    @Authorized()
    @Transaction()
    @Delete("/photos/:id")
    async remove(@Param("id") id: number) {

        // check if user is author of the removed photo
        const photo = await this.photoRepository.findOne(id, { relations: ["author"] });
        if (photo.author.id !== this.currentUser.id)
            throw new PhotoAccessDeniedError();

        // perform remove
        return this.photoRepository.remove(photo);
    }

}