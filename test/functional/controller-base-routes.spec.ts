import "reflect-metadata";
import {Controller} from "../../src/decorator/controllers";
import {Get} from "../../src/decorator/methods";
import {createServer, defaultMetadataArgsStorage} from "../../src/index";
const chakram = require("chakram");
const expect = chakram.expect;

describe("controller > base routes functionality", () => {
    before(() => {
        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @Controller("/posts")
        class PostController {
            @Get("/")
            getAll() {
                return "All posts";
            }
            @Get("/:id(\\d+)")
            getUserById() {
                return "One post";
            }
            @Get(/\/categories\/(\d+)/)
            getCategoryById() {
                return "One post category";
            }
            @Get("/:postId(\\d+)/users/:userId(\\d+)")
            getPostById() {
                return "One user";
            }
        }

    });

    let app: any;
    before(done => app = createServer().listen(3001, done));
    after(done => app.close(done));

    it("get should respond with proper status code, headers and body content", () => {
        return chakram
            .get("http://127.0.0.1:3001/posts")
            .then((response: any) => {
                expect(response).to.have.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                expect(response.body).to.be.equal("All posts");
            });
    });

    it("get should respond with proper status code, headers and body content", () => {
        return chakram
            .get("http://127.0.0.1:3001/posts/1")
            .then((response: any) => {
                expect(response).to.have.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                expect(response.body).to.be.equal("One post");
            });
    });

    it("get should respond with proper status code, headers and body content", () => {
        return chakram
            .get("http://127.0.0.1:3001/posts/1/users/2")
            .then((response: any) => {
                expect(response).to.have.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                expect(response.body).to.be.equal("One user");
            });
    });

    it("wrong route should respond with 404 error", () => {
        return chakram
            .get("http://127.0.0.1:3001/1/users/1")
            .then((response: any) => {
                expect(response).to.have.status(404);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            });
    });

    it("wrong route should respond with 404 error", () => {
        return chakram
            .get("http://127.0.0.1:3001/categories/1")
            .then((response: any) => {
                expect(response).to.have.status(404);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            });
    });

    it("wrong route should respond with 404 error", () => {
        return chakram
            .get("http://127.0.0.1:3001/users/1")
            .then((response: any) => {
                expect(response).to.have.status(404);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            });
    });
});