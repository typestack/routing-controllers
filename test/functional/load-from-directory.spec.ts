import "reflect-metadata";
import {createExpressServer, createKoaServer, defaultMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
import {Controller} from "../../src/decorator/controllers";
import {Get} from "../../src/decorator/methods";
import {defaultFakeService} from "../fakes/global-options/FakeService";
const chakram = require("chakram");
const expect = chakram.expect;

describe("controllers and middlewares bulk loading from directories", () => {

    describe("loading all controllers from the given directories", () => {

        before(() => defaultMetadataArgsStorage().reset());

        const serverOptions = {
            controllers: [
                __dirname + "/../fakes/global-options/first-controllers/**/*{.js,.ts}",
                __dirname + "/../fakes/global-options/second-controllers/*{.js,.ts}"
            ]
        };
        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer(serverOptions).listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer(serverOptions).listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "get", "posts", response => {
            expect(response.body).to.be.eql([{ id: 1, title: "#1" }, { id: 2, title: "#2" }]);
        });

        assertRequest([3001, 3002], "get", "questions", response => {
            expect(response.body).to.be.eql([{ id: 1, title: "#1" }, { id: 2, title: "#2" }]);
        });

        assertRequest([3001, 3002], "get", "answers", response => {
            expect(response.body).to.be.eql([{ id: 1, title: "#1" }, { id: 2, title: "#2" }]);
        });

        assertRequest([3001, 3002], "get", "photos", response => {
            expect(response.body).to.be.eql("Hello photos");
        });

        assertRequest([3001, 3002], "get", "videos", response => {
            expect(response.body).to.be.eql("Hello videos");
        });
    });

    describe("loading all express middlewares and error handlers from the given directories", () => {

        before(() => defaultMetadataArgsStorage().reset());

        before(() => {
            @Controller()
            class ExpressMiddlewareDirectoriesController {

                @Get("/publications")
                publications(): any[] {
                    return [];
                }

                @Get("/articles")
                articles(): any[] {
                    throw new Error("Cannot load articles");
                }

            }
        });

        const serverOptions = {
            middlewares: [
                __dirname + "/../fakes/global-options/express-middlewares/**/*{.js,.ts}"
            ],
        };
        let expressApp: any;
        before(done => expressApp = createExpressServer(serverOptions).listen(3001, done));
        after(done => expressApp.close(done));

        beforeEach(() => defaultFakeService.reset());

        assertRequest([3001], "get", "publications", response => {
            expect(response).to.have.status(200);
            expect(defaultFakeService.postMiddlewareCalled).to.be.true;
            expect(defaultFakeService.questionMiddlewareCalled).to.be.true;
            expect(defaultFakeService.questionErrorMiddlewareCalled).to.be.false;
            expect(defaultFakeService.fileMiddlewareCalled).to.be.false;
            expect(defaultFakeService.videoMiddlewareCalled).to.be.false;
        });

        assertRequest([3001], "get", "articles", response => {
            expect(response).to.have.status(500);
            expect(defaultFakeService.postMiddlewareCalled).to.be.true;
            expect(defaultFakeService.questionMiddlewareCalled).to.be.true;
            expect(defaultFakeService.questionErrorMiddlewareCalled).to.be.true;
            expect(defaultFakeService.fileMiddlewareCalled).to.be.false;
            expect(defaultFakeService.videoMiddlewareCalled).to.be.false;
        });

    });

    describe("loading all koa middlewares from the given directories", () => {

        before(() => defaultMetadataArgsStorage().reset());

        before(() => {
            @Controller()
            class KoaMiddlewareDirectoriesController {

                @Get("/publications")
                publications(): any[] {
                    return [];
                }

                @Get("/articles")
                articles(): any[] {
                    throw new Error("Cannot load articles");
                }

            }
        });

        const serverOptions = {
            middlewares: [
                __dirname + "/../fakes/global-options/koa-middlewares/**/*{.js,.ts}"
            ]
        };
        let koaApp: any;
        before(done => koaApp = createKoaServer(serverOptions).listen(3002, done));
        after(done => koaApp.close(done));

        beforeEach(() => defaultFakeService.reset());

        assertRequest([3002], "get", "publications", response => {
            expect(response).to.have.status(200);
            expect(defaultFakeService.postMiddlewareCalled).to.be.false;
            expect(defaultFakeService.questionMiddlewareCalled).to.be.false;
            expect(defaultFakeService.questionErrorMiddlewareCalled).to.be.false;
            expect(defaultFakeService.fileMiddlewareCalled).to.be.true;
            expect(defaultFakeService.videoMiddlewareCalled).to.be.true;
        });

        assertRequest([3002], "get", "articles", response => {
            // expect(response).to.have.status(500);
            expect(defaultFakeService.postMiddlewareCalled).to.be.false;
            expect(defaultFakeService.questionMiddlewareCalled).to.be.false;
            expect(defaultFakeService.questionErrorMiddlewareCalled).to.be.false;
            expect(defaultFakeService.fileMiddlewareCalled).to.be.true;
            expect(defaultFakeService.videoMiddlewareCalled).to.be.true;
        });

    });

});


/*
fakeContainer.services[(FakeService as any).name] = sinon.stub(new FakeService());
// container: fakeContainer*/
