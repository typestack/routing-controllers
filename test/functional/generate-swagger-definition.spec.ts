import "reflect-metadata";
import {Controller} from "../../src/decorator/controllers";
import {Middleware, UseBefore, JsonResponse, ContentType} from "../../src/decorator/decorators";
import {Get, Post} from "../../src/decorator/methods";
import {createExpressServer, defaultMetadataArgsStorage, createKoaServer} from "../../src/index";
import {assertRequest} from "./test-utils";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";
import {Body, Param, QueryParam, UploadedFile, UploadedFiles} from "../../src/decorator/params";
const chakram = require("chakram");
const expect = chakram.expect;

/**
 * Created by Pierre Awaragi on 2017-02-16.
 */
describe.only("swagger enabled", () => {

    before(() => {

        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @Middleware()
        class AuthenticatedMiddelware implements MiddlewareInterface {
            use(request: any, response: any, next?: (err?: any) => any): any {
            }
        }

        @Controller("api")
        class BasicController {
            @Get("/get.xml")
            @ContentType("application/xml")
            testXmlContentType() {
            }

            @UseBefore(AuthenticatedMiddelware)
            @Get("/get.json")
            @ContentType("application/json")
            testJsonContentType() {
            }

            @Get("/get2.json")
            @JsonResponse()
            testJsonContentType2() {
            }

            @Post("/post.empty")
            testPost() {
            }

            @Post("/post/body")
            testPostBody(@Body() body: any) {
            }

            @Get("/get/:id")
            testParam(@Param("id") id: number) {
            }

            @Get("/get/query")
            testQueryParam(@QueryParam("id") id: string) {
            }

            @Post("/post/file")
            testFile(@UploadedFile("file") file: any) {
            }

            @Post("/post/files")
            testFiles(@UploadedFiles("files") files: any) {
            }

        }
    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer({swagger: {enabled: true}}).listen(3001, done));
    after(done => expressApp.close(done));

    describe("get swagger.json expected structure", () => {
        assertRequest([3001], "get", "swagger.json", response => {
            expect(response).to.have.status(200);
            // expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            let definition = response.body;

            // write swagger file for visual inspection using Swagger UI
            require("fs").writeFileSync("/tmp/swagger.json", JSON.stringify(response.body));

            expect(definition).to.be.deep.equal( {
                "swagger": "2.0",
                "basePath": "/",
                "paths": {
                    "api/get.xml": {
                        "get": {
                            "operationId": "testXmlContentType",
                            "description": "",
                            "produces": [
                                "application/xml"
                            ],
                            "parameters": []
                        }
                    },
                    "api/get.json": {
                        "get": {
                            "operationId": "testJsonContentType",
                            "description": "(-AuthenticatedMiddelware)",
                            "produces": [
                                "application/json"
                            ],
                            "parameters": []
                        }
                    },
                    "api/get2.json": {
                        "get": {
                            "operationId": "testJsonContentType2",
                            "description": "",
                            "produces": [
                                "application/json"
                            ],
                            "parameters": []
                        }
                    },
                    "api/post.empty": {
                        "post": {
                            "operationId": "testPost",
                            "description": "",
                            "produces": [],
                            "parameters": []
                        }
                    },
                    "api/post/body": {
                        "post": {
                            "operationId": "testPostBody",
                            "description": "",
                            "produces": [],
                            "parameters": [
                                {
                                    "in": "body",
                                    "name": null,
                                    "type": "Object",
                                    "required": false
                                }
                            ]
                        }
                    },
                    "api/get/:id": {
                        "get": {
                            "operationId": "testParam",
                            "description": "",
                            "produces": [],
                            "parameters": [
                                {
                                    "in": "param",
                                    "name": "id",
                                    "type": "Number",
                                    "required": true
                                }
                            ]
                        }
                    },
                    "api/get/query": {
                        "get": {
                            "operationId": "testQueryParam",
                            "description": "",
                            "produces": [],
                            "parameters": [
                                {
                                    "in": "query",
                                    "name": "id",
                                    "type": "String",
                                    "required": false
                                }
                            ]
                        }
                    },
                    "api/post/file": {
                        "post": {
                            "operationId": "testFile",
                            "description": "",
                            "produces": [],
                            "parameters": [
                                {
                                    "in": "file",
                                    "name": "file",
                                    "type": "file",
                                    "required": false
                                }
                            ]
                        }
                    },
                    "api/post/files": {
                        "post": {
                            "operationId": "testFiles",
                            "description": "",
                            "produces": [],
                            "parameters": [
                                {
                                    "in": "files",
                                    "name": "files",
                                    "required": false
                                }
                            ]
                        }
                    }
                }
            });
        });
    });
});

describe("swagger disabled", () => {

    before(() => {
        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @Controller("/basic")
        class BasicController {
            @Get()
            get() {
            }
        }
    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    describe("get swagger.json expected to fail", () => {
        assertRequest([3001, 3002], "get", "swagger.json", response => {
            expect(response).to.have.status(404);
        });
    });
});