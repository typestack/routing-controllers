import "reflect-metadata";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {createExpressServer, createKoaServer, defaultMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
import {Render} from "../../src/decorator/Render";
const chakram = require("chakram");
const expect = chakram.expect;

describe("template rendering", () => {

    before(() => {

        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @Controller()
        class RenderController {

            @Get("/index")
            @Render("render-test-spec.html")
            index() {
                return {
                    name: "Routing-controllers"
                };
            }
            
        }
    });

    let expressApp: any;
    before(done => {
        const path = __dirname + "/../../../../test/resources";
        const server = createExpressServer();
        const mustacheExpress = require("mustache-express");
        server.engine("html", mustacheExpress());
        server.set("view engine", "html");
        server.set("views", path);
        server.use(require("express").static(path));
        expressApp = server.listen(3001, done);
    });
    after(done => expressApp.close(done));

    let koaApp: any;
    before(done => {
        const path = __dirname + "/../../../../test/resources";
        const server = createKoaServer();
        let koaViews = require("koa-views");
        server.use(koaViews(path, { map: { html: "handlebars" } } ));
        koaApp = server.listen(3002, done);
    });
    after(done => koaApp.close(done));

    describe("should render a template and use given variables", () => {
        assertRequest([3001, 3002], "get", "index", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.contain("<html>");
            expect(response.body).to.contain("<body>");
            expect(response.body).to.contain("Routing-controllers");
            expect(response.body).to.contain("</body>");
            expect(response.body).to.contain("</html>");
        });
    });

});