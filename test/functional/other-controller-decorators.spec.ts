import "reflect-metadata";
import {Controller} from "../../src/decorator/controllers";
import {Get, Post} from "../../src/decorator/methods";
import {createServer, defaultMetadataArgsStorage} from "../../src/index";
import {
    HttpCode,
    EmptyResultCode,
    NullResultCode,
    UndefinedResultCode,
    ContentType,
    Header,
    Location,
    Redirect
} from "../../src/decorator/decorators";
import {Param} from "../../src/decorator/params";
const chakram = require("chakram");
const expect = chakram.expect;

describe("other controller decorators", () => {
    before(() => {

        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @Controller()
        class OtherDectoratorsController {
            
            @Post("/users")
            @HttpCode(201)
            getUsers() {
                return "User has been created";
            }
            
            @Get("/admin")
            @HttpCode(403)
            getAdmin() {
                return "Access is denied";
            }

            @Get("/users/:id")
            @EmptyResultCode(404)
            getUser(@Param("id") id: number) {
                return new Promise((ok, fail) => {
                    if (id === 1) {
                        ok("User");

                    } else if (id === 2) {
                        ok("");

                    } else if (id === 3) {
                        ok(null);

                    } else {
                        ok(undefined);
                    }
                });
            }

            @Get("/posts/:id")
            @NullResultCode(404)
            getPost(@Param("id") id: number) {
                return new Promise((ok, fail) => {
                    if (id === 1) {
                        ok("Post");

                    } else if (id === 2) {
                        ok("");

                    } else if (id === 3) {
                        ok(null);

                    } else {
                        ok(undefined);
                    }
                });
            }

            @Get("/photos/:id")
            @UndefinedResultCode(201)
            getPhoto(@Param("id") id: number) {
                if (id === 4) {
                    return undefined;
                }
                
                return new Promise((ok, fail) => {
                    if (id === 1) {
                        ok("Photo");

                    } else if (id === 2) {
                        ok("");

                    } else if (id === 3) {
                        ok(null);

                    } else {
                        ok(undefined);
                    }
                });
            }

            @Get("/homepage")
            @ContentType("text/html")
            getHomepage() {
                return "<html><body>Hello world</body></html>";
            }

            @Get("/userdash")
            @Header("authorization", "Barer abcdefg")
            @Header("development-mode", "enabled")
            getUserdash() {
                return "Hello, User";
            }

            @Get("/github")
            @Location("http://github.com")
            getToGithub() {
                return "Hello, github";
            }

            @Get("/github-redirect")
            @Redirect("http://github.com")
            goToGithub() { // todo: need test for this one
                return "Hello, github";
            }
            
        }
    });

    let app: any;
    before(done => app = createServer().listen(3001, done));
    after(done => app.close(done));

    it("should return httpCode set by @HttpCode decorator", () => {
        return Promise.all([
            chakram
                .post("http://127.0.0.1:3001/users", { name: "Umed" })
                .then((response: any) => {
                    expect(response).to.have.status(201);
                    expect(response.body).to.be.eql("User has been created");
                }),
            chakram
                .get("http://127.0.0.1:3001/admin")
                .then((response: any) => {
                    expect(response).to.have.status(403);
                    expect(response.body).to.be.eql("Access is denied");
                })
        ]);
    });

    it("should return custom code when @EmptyResultCode", () => {
        return Promise.all([
            chakram
                .get("http://127.0.0.1:3001/users/1")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response.body).to.be.eql("User");
                }),
            chakram
                .get("http://127.0.0.1:3001/users/2")
                .then((response: any) => {
                    expect(response).to.have.status(404);
                }),
            chakram
                .get("http://127.0.0.1:3001/users/3")
                .then((response: any) => {
                    expect(response).to.have.status(404);
                }),
            chakram
                .get("http://127.0.0.1:3001/users/4")
                .then((response: any) => {
                    expect(response).to.have.status(404);
                }),
            chakram
                .get("http://127.0.0.1:3001/users/5")
                .then((response: any) => {
                    expect(response).to.have.status(404);
                })
        ]);
    });

    it("should return custom code when @NullResultCode", () => {
        return Promise.all([
            chakram
                .get("http://127.0.0.1:3001/posts/1")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response.body).to.be.eql("Post");
                }),
            chakram
                .get("http://127.0.0.1:3001/posts/2")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                }),
            chakram
                .get("http://127.0.0.1:3001/posts/3")
                .then((response: any) => {
                    expect(response).to.have.status(404);
                }),
            chakram
                .get("http://127.0.0.1:3001/posts/4")
                .then((response: any) => {
                    expect(response).to.have.status(404); // this is expected because for undefined 404 is given by default
                }),
            chakram
                .get("http://127.0.0.1:3001/posts/5")
                .then((response: any) => {
                    expect(response).to.have.status(404); // this is expected because for undefined 404 is given by default
                })
        ]);
    });
    
    it("should return custom code when @UndefinedResultCode", () => {
        return Promise.all([
            chakram
                .get("http://127.0.0.1:3001/photos/1")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response.body).to.be.eql("Photo");
                }),
            chakram
                .get("http://127.0.0.1:3001/photos/2")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                }),
            chakram
                .get("http://127.0.0.1:3001/photos/3")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                }),
            chakram
                .get("http://127.0.0.1:3001/photos/4")
                .then((response: any) => {
                    expect(response).to.have.status(201);
                }),
            chakram
                .get("http://127.0.0.1:3001/photos/5")
                .then((response: any) => {
                    expect(response).to.have.status(201);
                })
        ]);
    });

    it("should return content-type in the response when @ContentType is used", () => {
        return chakram
            .get("http://127.0.0.1:3001/homepage")
            .then((response: any) => {
                expect(response).to.have.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                expect(response.body).to.be.eql("<html><body>Hello world</body></html>");
            });
    });

    it("should return response with custom headers when @Header is used", () => {
        return chakram
            .get("http://127.0.0.1:3001/userdash")
            .then((response: any) => {
                expect(response).to.have.status(200);
                expect(response).to.have.header("authorization", "Barer abcdefg");
                expect(response).to.have.header("development-mode", "enabled");
                expect(response.body).to.be.eql("Hello, User");
            });
    });

    it("should relocate to new location when @Location is used", () => {
        return chakram
            .get("http://127.0.0.1:3001/github")
            .then((response: any) => {
                expect(response).to.have.status(200);
                expect(response).to.have.header("location", "http://github.com");
            });
    });

});