import {Body, Delete, Get, JsonController, Param, Post, Put} from "../../../../../../src/index";
import {Transaction} from "typeorm";
import {Album} from "../entity/Album";
import {AlbumRepository} from "../repository/AlbumRepository";
import {Authorized} from "../../../../../../src";

@JsonController()
export class AlbumController {

    constructor(private albumRepository: AlbumRepository) {
    }

    @Get("/albums")
    all() {
        return this.albumRepository.find();
    }

    @Get("/albums/:id")
    one(@Param("id") id: number) {
        return this.albumRepository.findOne(id, { relations: ["photos"] });
    }

    @Authorized()
    @Transaction()
    @Post("/albums")
    insert(@Body() album: Album) {
        return this.albumRepository.save(album);
    }

    @Authorized()
    @Transaction()
    @Put("/albums/:id")
    async update(@Param("id") id: number, @Body() album: Album) {
        return this.albumRepository.save(album);
    }

    @Authorized()
    @Transaction()
    @Delete("/albums/:id")
    async remove(@Param("id") id: number) {

        // find album to be removed
        const album = await this.albumRepository.findOne(id);

        // perform remove
        return this.albumRepository.remove(album);
    }

}