import "reflect-metadata";
import {Get} from "../../src/decorator/Get";
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
import {Redirect} from "../../src/decorator/Redirect";
import {JsonController} from "../../src/decorator/JsonController";
const chakram = require("chakram");
const expect = chakram.expect;

describe("dynamic redirect", function () {

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @JsonController()
        class RedirectController {

            @Get("/template")
            @Redirect("https://api.github.com/users/:owner")
            template() {
                // console.log("/template");
                return {owner: "pleerock", repo: "routing-controllers"};
            }

            @Get("/original")
            @Redirect("https://api.github.com/users/pleerock")
            original() {
                // console.log("/original");
            }

            @Get("/override")
            @Redirect("https://api.github.com")
            override() {
                // console.log("/override");
                return "https://api.github.com/users/pleerock";
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

    this.timeout(5000); // 2000ms timeout

    describe("using template", () => {
        assertRequest([3001, 3002], "get", "template", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
            }
        }, response => {
            expect(response).to.have.status(200);
            expect(response.body).has.property("login", "pleerock");
        });
    });

    describe("using override", () => {
        assertRequest([3001, 3002], "get", "override", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
            }
        }, response => {
            expect(response).to.have.status(200);
            expect(response.body).has.property("login", "pleerock");
        });
    });

    describe("using original", () => {
        assertRequest([3001, 3002], "get", "original", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
            }
        }, response => {
            expect(response).to.have.status(200);
            expect(response.body).has.property("login", "pleerock");
        });
    });

});