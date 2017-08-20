import { suite, test } from "mocha-typescript";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import { server } from "./app";

const assert = chai.assert;
const expect = chai.expect;

@suite("ExampleController tests")
class ExampleControllerTests {

    // FixtureSetUp
    public static before(): void {
        chai.use(chaiHttp);
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

}
