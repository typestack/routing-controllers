import "reflect-metadata";
import {Get} from "../../src/decorator/Get";
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
import {Redirect} from "../../src/decorator/Redirect";
import {JsonController} from "../../src/decorator/JsonController";
import {PathParam} from "../../src/decorator/PathParam";
const chakram = require("chakram");
const expect = chakram.expect;

describe("dynamic redirect", function () {

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @JsonController("/users")
        class TestController {

            @Get("/:id")
            async getOne(@PathParam("id") id: string) {
                return {
                    login: id
                };
            }


        }

        @JsonController()
        class RedirectController {

            @Get("/template")
            @Redirect("/users/:owner")
            template() {
                return {owner: "pleerock", repo: "routing-controllers"};
            }

            @Get("/original")
            @Redirect("/users/pleerock")
            original() {
            }

            @Get("/override")
            @Redirect("https://api.github.com")
            override() {
                return "/users/pleerock";
            }

        }
    });

    let expressApp: any;
    before(done => {
        const server = createExpressServer();
        expressApp = server.listen(3001, done);
    });
    after(done => expressApp.close(done));

    let koaApp: any;
    before(done => {
        const server = createKoaServer();
        koaApp = server.listen(3002, done);
    });
    after(done => koaApp.close(done));

    describe("using template", () => {
        assertRequest([3001, 3002], "get", "template", response => {
            expect(response).to.have.status(200);
            expect(response.body).has.property("login", "pleerock");
        });
    });

    describe("using override", () => {
        assertRequest([3001, 3002], "get", "override", response => {
            expect(response).to.have.status(200);
            expect(response.body).has.property("login", "pleerock");
        });
    });

    describe("using original", () => {
        assertRequest([3001, 3002], "get", "original", response => {
            expect(response).to.have.status(200);
            expect(response.body).has.property("login", "pleerock");
        });
    });

});