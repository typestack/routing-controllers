import { Container } from "typedi";
import { suite, test } from "mocha-typescript";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import server from "./app";
import { ExampleServiceMock } from "./Example.service.mock";
import { ExampleService } from "./Example.service";

const assert = chai.assert;
const expect = chai.expect;

@suite("ExampleController tests")
class ExampleControllerTests {

    // FixtureSetUp
    public static before(): void {
        chai.use(chaiHttp);
        // setting mocks instead of the real service
        Container.set("example.service", new ExampleServiceMock());
    }

    @test("A dumb test")
    public ShouldBeDumbTrue() {
        const variable = "Hey there ! I'm a dummy test. What are you ?";
        expect(variable).to.be.a("string");
        expect(variable).to.have.length(variable.length);
    }

    @test("/api/v1 should return 'Hello world !'")
    public ShouldReturnHelloWorld(done: any) {
        chai.request(server)
        .get("/api/v1")
        .end((err: any, res: any) => {
            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.equal("Hello world !");
            done();
        });
    }

    @test("/api/v1/all should call example service mock getAll method")
    public ShouldCallExampleServiceMockGetAllMethod(done: any) {
        chai.request(server)
        .get("/api/v1/all")
        .end((err: any, res: any) => {
            expect(res.status).to.be.equal(200);
            // we check we have called the mocks and not the real service
            expect(res.body.length).to.be.equal(1);
            expect(res.body[0].id).to.be.equal(42);
            done();
        });
    }

}
