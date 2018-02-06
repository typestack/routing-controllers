import {JsonController, Post, UploadedFile} from "../../../../../../src/index";
import {PhotoUploader} from "../service/PhotoUploader";
import {Authorized} from "../../../../../../src";

@JsonController()
export class PhotoUploadController {

    constructor(private photoUploader: PhotoUploader) {
    }

    @Authorized()
    @Post("/photo-files")
    async insert(@UploadedFile("file") file: any) {
        await this.photoUploader.upload(file);
    }

}