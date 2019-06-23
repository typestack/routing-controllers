import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {createExpressServer, createKoaServer, getMetadataArgsStorage, Action} from "../../src/index";
import {assertRequest} from "./test-utils";
import {Container, Service} from "typedi";
import {useContainer, IocAdapter, ClassConstructor} from "../../src/container";
import {Get} from "../../src/decorator/Get";
import * as assert from "assert";
const chakram = require("chakram");
const expect = chakram.expect;

describe("container", () => {

    describe("using typedi container should be possible", () => {

        before(() => {

            @Service()
            class QuestionRepository {

                findQuestions(): any[] {
                    return [{
                        id: 1,
                        title: "question #1"
                    }, {
                        id: 2,
                        title: "question #2"
                    }];
                }

            }

            @Service()
            class PostRepository {

                findPosts(): any[] {
                    return [{
                        id: 1,
                        title: "post #1"
                    }, {
                        id: 2,
                        title: "post #2"
                    }];
                }

            }

            // reset metadata args storage
            useContainer(Container);
            getMetadataArgsStorage().reset();

            @Service()
            @JsonController()
            class TestContainerController {

                constructor(private questionRepository: QuestionRepository,
                            private postRepository: PostRepository) {
                }

                @Get("/questions")
                questions(): any[] {
                    return this.questionRepository.findQuestions();
                }

                @Get("/posts")
                posts(): any[] {
                    return this.postRepository.findPosts();
                }

            }
        });

        after(() => {
            useContainer(undefined);
        });

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer().listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer().listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "get", "questions", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql([{
                id: 1,
                title: "question #1"
            }, {
                id: 2,
                title: "question #2"
            }]);
        });

        assertRequest([3001, 3002], "get", "posts", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql([{
                id: 1,
                title: "post #1"
            }, {
                id: 2,
                title: "post #2"
            }]);
        });
    });

    describe("using custom container should be possible", () => {

        let fakeContainer: IocAdapter & {
            services: { [key: string]: any }
            context: any[]
        };

        before(() => {

            fakeContainer = {
                services: {},
                context: [],

                get<T>(service: ClassConstructor<T>, action: Action): T {

                    this.context.push(action.context);
                    
                    if (!this.services[service.name]) {
                        this.services[service.name] = new service();
                    }

                    return this.services[service.name] as T;
                }
            };


            class QuestionRepository {

                findQuestions(): any[] {
                    return [{
                        id: 1,
                        title: "question #1"
                    }, {
                        id: 2,
                        title: "question #2"
                    }];
                }

            }

            class PostRepository {

                findPosts(): any[] {
                    return [{
                        id: 1,
                        title: "post #1"
                    }, {
                        id: 2,
                        title: "post #2"
                    }];
                }

            }

            // reset metadata args storage
            useContainer(fakeContainer);
            getMetadataArgsStorage().reset();

            @JsonController()
            class TestContainerController {

                constructor(private questionRepository: QuestionRepository,
                            private postRepository: PostRepository) {
                }

                @Get("/questions")
                questions(): any[] {
                    return this.questionRepository.findQuestions();
                }

                @Get("/posts")
                posts(): any[] {
                    return this.postRepository.findPosts();
                }

            }

            const postRepository = new PostRepository();
            const questionRepository = new QuestionRepository();
            fakeContainer.services["TestContainerController"] = new TestContainerController(questionRepository, postRepository);
        });

        after(() => {
            useContainer(undefined);
        });

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer().listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer().listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "get", "questions", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql([{
                id: 1,
                title: "question #1"
            }, {
                id: 2,
                title: "question #2"
            }]);
        });

        assertRequest([3001, 3002], "get", "posts", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql([{
                id: 1,
                title: "post #1"
            }, {
                id: 2,
                title: "post #2"
            }]);
        });

        it("should pass the action through to the Ioc adapter", () => {
            assert.notEqual(fakeContainer.context.length, 0);
        });
    });

    describe("using custom container with fallback should be possible", () => {

        before(() => {

            const fakeContainer = {
                services: [] as any,

                get(service: any): any {
                    return this.services[service.name];
                }
            };


            class QuestionRepository {

                findQuestions(): any[] {
                    return [{
                        id: 1,
                        title: "question #1"
                    }, {
                        id: 2,
                        title: "question #2"
                    }];
                }

            }

            class PostRepository {

                findPosts(): any[] {
                    return [{
                        id: 1,
                        title: "post #1"
                    }, {
                        id: 2,
                        title: "post #2"
                    }];
                }

            }

            // reset metadata args storage
            useContainer(fakeContainer, { fallback: true });
            getMetadataArgsStorage().reset();

            @JsonController()
            class TestContainerController {

                constructor(private questionRepository: QuestionRepository,
                            private postRepository: PostRepository) {
                }

                @Get("/questions")
                questions(): any[] {
                    return this.questionRepository.findQuestions();
                }

                @Get("/posts")
                posts(): any[] {
                    return this.postRepository.findPosts();
                }

            }

            @JsonController()
            class SecondTestContainerController {

                @Get("/photos")
                photos(): any[] {
                    return [{
                        id: 1,
                        title: "photo #1"
                    }, {
                        id: 2,
                        title: "photo #2"
                    }];
                }

            }

            const postRepository = new PostRepository();
            const questionRepository = new QuestionRepository();
            fakeContainer.services["TestContainerController"] = new TestContainerController(questionRepository, postRepository);
        });

        after(() => {
            useContainer(undefined);
        });

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer().listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer().listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "get", "questions", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql([{
                id: 1,
                title: "question #1"
            }, {
                id: 2,
                title: "question #2"
            }]);
        });

        assertRequest([3001, 3002], "get", "posts", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql([{
                id: 1,
                title: "post #1"
            }, {
                id: 2,
                title: "post #2"
            }]);
        });

        assertRequest([3001, 3002], "get", "photos", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql([{
                id: 1,
                title: "photo #1"
            }, {
                id: 2,
                title: "photo #2"
            }]);
        });
    });

    describe("using custom container with fallback and fallback on throw error should be possible", () => {

        before(() => {

            const fakeContainer = {
                services: [] as any,

                get(service: any): any {
                    if (!this.services[service.name])
                        throw new Error(`Provider was not found for ${service.name}`);

                    return this.services[service.name];
                }
            };


            class QuestionRepository {

                findQuestions(): any[] {
                    return [{
                        id: 1,
                        title: "question #1"
                    }, {
                        id: 2,
                        title: "question #2"
                    }];
                }

            }

            class PostRepository {

                findPosts(): any[] {
                    return [{
                        id: 1,
                        title: "post #1"
                    }, {
                        id: 2,
                        title: "post #2"
                    }];
                }

            }

            // reset metadata args storage
            useContainer(fakeContainer, { fallback: true, fallbackOnErrors: true });
            getMetadataArgsStorage().reset();

            @JsonController()
            class TestContainerController {

                constructor(private questionRepository: QuestionRepository,
                            private postRepository: PostRepository) {
                }

                @Get("/questions")
                questions(): any[] {
                    return this.questionRepository.findQuestions();
                }

                @Get("/posts")
                posts(): any[] {
                    return this.postRepository.findPosts();
                }

            }

            @JsonController()
            class SecondTestContainerController {

                @Get("/photos")
                photos(): any[] {
                    return [{
                        id: 1,
                        title: "photo #1"
                    }, {
                        id: 2,
                        title: "photo #2"
                    }];
                }

            }

            const postRepository = new PostRepository();
            const questionRepository = new QuestionRepository();
            fakeContainer.services["TestContainerController"] = new TestContainerController(questionRepository, postRepository);
        });

        after(() => {
            useContainer(undefined);
        });

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer().listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer().listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "get", "questions", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql([{
                id: 1,
                title: "question #1"
            }, {
                id: 2,
                title: "question #2"
            }]);
        });

        assertRequest([3001, 3002], "get", "posts", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql([{
                id: 1,
                title: "post #1"
            }, {
                id: 2,
                title: "post #2"
            }]);
        });

        assertRequest([3001, 3002], "get", "photos", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql([{
                id: 1,
                title: "photo #1"
            }, {
                id: 2,
                title: "photo #2"
            }]);
        });
    });

});