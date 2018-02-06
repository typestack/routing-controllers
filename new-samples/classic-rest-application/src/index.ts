import {bootstrap} from "../src/index";
import {CurrentUser} from "./module/user/model/CurrentUser";

bootstrap({
    port: 3000,
    controllers: ["modules/**/controller/*.{ts,js}"],
    middlewares: ["modules/**/middleware/*.{ts,js}"],
    currentUser: CurrentUser
});