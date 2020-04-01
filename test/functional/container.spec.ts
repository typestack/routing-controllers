import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {Container, Service} from "typedi";
import {useContainer} from "../../src/util/container";
import {Get} from "../../src/decorator/Get";
import {Server as HttpServer} from "http";
import DoneCallback = jest.DoneCallback;
import {AxiosResponse} from "axios";
import HttpStatusCodes from "http-status-codes";
import {axios} from "../utilities/axios";

describe("using typedi container should be possible", () => {
    let expressServer: HttpServer;

    beforeEach((done: DoneCallback) => {
        // reset metadata args storage
        useContainer(Container);
        getMetadataArgsStorage().reset();

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

        expressServer = createExpressServer().listen(3001, done);
    });

    afterEach((done: DoneCallback) => {
        useContainer(undefined);
        expressServer.close(done);
    });

    it("typedi container", () => {
        expect.assertions(4);
        return Promise.all<AxiosResponse | void>([
            axios.get("/questions")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{
                        id: 1,
                        title: "question #1"
                    }, {
                        id: 2,
                        title: "question #2"
                    }]);
                }),
            axios.get("/posts")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{
                        id: 1,
                        title: "post #1"
                    }, {
                        id: 2,
                        title: "post #2"
                    }]);
                })
        ]);
    });
});

describe("using custom container should be possible", () => {
    let expressServer: HttpServer;

    beforeEach((done: DoneCallback) => {
        const fakeContainer = {
            services: [] as any,

            get(service: any) {
                if (!this.services[service.name]) {
                    this.services[service.name] = new service();
                }

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
        expressServer = createExpressServer().listen(3001, done);
    });

    afterEach((done: DoneCallback) => {
        useContainer(undefined);
        expressServer.close(done);
    });

    it("custom container", () => {
        expect.assertions(4);
        return Promise.all<AxiosResponse | void>([
            axios.get("/questions")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{
                        id: 1,
                        title: "question #1"
                    }, {
                        id: 2,
                        title: "question #2"
                    }]);
                }),
            axios.get("/posts")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{
                        id: 1,
                        title: "post #1"
                    }, {
                        id: 2,
                        title: "post #2"
                    }]);
                })
        ]);
    });
});

describe("using custom container with fallback should be possible", () => {
    let expressServer: HttpServer;

    beforeEach((done: DoneCallback) => {
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
        useContainer(fakeContainer, {fallback: true});
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
        expressServer = createExpressServer().listen(3001, done);
    });

    afterEach((done: DoneCallback) => {
        useContainer(undefined);
        expressServer.close(done);
    });

    it("custom container with fallback", () => {
        expect.assertions(6);
        return Promise.all<AxiosResponse | void>([
            axios.get("/questions")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{
                        id: 1,
                        title: "question #1"
                    }, {
                        id: 2,
                        title: "question #2"
                    }]);
                }),
            axios.get("/posts")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{
                        id: 1,
                        title: "post #1"
                    }, {
                        id: 2,
                        title: "post #2"
                    }]);
                }),
            axios.get("/photos")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{
                        id: 1,
                        title: "photo #1"
                    }, {
                        id: 2,
                        title: "photo #2"
                    }]);
                })
        ]);
    });
});

describe("using custom container with fallback and fallback on throw error should be possible", () => {
    let expressServer: HttpServer;

    beforeEach((done: DoneCallback) => {
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
        useContainer(fakeContainer, {fallback: true, fallbackOnErrors: true});
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
        expressServer = createExpressServer().listen(3001, done);
    });

    afterEach((done: DoneCallback) => {
        useContainer(undefined);
        expressServer.close(done);
    });

    it("custom container with fallback and fallback on throw error", () => {
        expect.assertions(6);
        return Promise.all<AxiosResponse | void>([
            axios.get("/questions")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{
                        id: 1,
                        title: "question #1"
                    }, {
                        id: 2,
                        title: "question #2"
                    }]);
                }),
            axios.get("/posts")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{
                        id: 1,
                        title: "post #1"
                    }, {
                        id: 2,
                        title: "post #2"
                    }]);
                }),
            axios.get("/photos")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{
                        id: 1,
                        title: "photo #1"
                    }, {
                        id: 2,
                        title: "photo #2"
                    }]);
                })
        ]);
    });
});

