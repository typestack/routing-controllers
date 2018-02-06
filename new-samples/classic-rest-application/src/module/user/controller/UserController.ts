import {Body, Delete, Get, JsonController, Param, Post, QueryParam} from "../../../../../../src/index";
import {Transaction} from "typeorm";
import {User} from "../entity/User";
import {UserRepository} from "../repository/UserRepository";
import {PasswordEncryptor} from "../service/PasswordEncryptor";
import {Authorized} from "../../../../../../src";

@JsonController()
export class UserController {

    constructor(private userRepository: UserRepository,
                private passwordEncryptor: PasswordEncryptor) {
    }

    @Get("/users")
    all(@QueryParam("offset") offset: number, @QueryParam("limit") limit: number) {
        return this.userRepository.find({ skip: offset, take: limit });
    }

    @Get("/users/:id")
    one(@Param("id") id: number) {
        return this.userRepository.findOne(id);
    }

    @Authorized()
    @Transaction()
    @Post("/users")
    save(@Body() user: User) {
        user.password = this.passwordEncryptor.encrypt(user.password);
        return this.userRepository.save(user); // userRepository is transactional automatically (di scopes)
    }

    @Authorized()
    @Transaction()
    @Delete("/users/:id")
    async remove(@Param("id") id: number) {
        const user = await this.userRepository.findOne(id);
        return this.userRepository.remove(user);
    }

}