import "reflect-metadata";
import {Controller} from "../../src/decorator/controllers";
import {Get} from "../../src/decorator/methods";
import {createServer, defaultMetadataArgsStorage} from "../../src/index";
import {Render} from "../../src/decorator/decorators";
const chakram = require("chakram");
const expect = chakram.expect;

describe("Template rendering", () => {

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

    let app: any;
    before(done => {
        const path = __dirname + "/../../../../test/resources";
        const server = createServer();
        const mustacheExpress = require("mustache-express");
        server.engine("html", mustacheExpress());
        server.set("view engine", "html");
        server.set("views", path);
        server.use(require("express").static(path));
        app = server.listen(3001, done)
    });
    after(done => app.close(done));

    it("should render a template and use given variables", () => {
        return chakram
            .get("http://127.0.0.1:3001/index")
            .then((response: any) => {
                expect(response).to.have.status(200);
                expect(response.body).to.contain("<html>");
                expect(response.body).to.contain("<body>");
                expect(response.body).to.contain("Routing-controllers");
                expect(response.body).to.contain("</body>");
                expect(response.body).to.contain("</html>");
            });
    });

});