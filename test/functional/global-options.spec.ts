import "reflect-metadata";
import {JsonController} from "../../src/decorator/controllers";
import {Post} from "../../src/decorator/methods";
import {createServer, defaultMetadataArgsStorage} from "../../src/index";
import {Body} from "../../src/decorator/params";
const chakram = require("chakram");
const expect = chakram.expect;

export class User {
    firstName: string;
    lastName: string;
    getName(): string {
        return this.firstName + " " + this.lastName;
    }
}

describe("routing-controllers global options", () => {

    let initializedUser: User;

    beforeEach(() => {
        initializedUser = undefined;
    });

    before(() => {

        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @JsonController()
        class TestUserController {

            @Post("/users")
            postUsers(@Body() user: User) {
                initializedUser = user;
                return "";
            }
            
        }
    });

    describe("when useConstructorUtils is set to true", () => {
    
        let app: any;
        before(done => app = createServer({ useConstructorUtils: true }).listen(3001, done));
        after(done => app.close(done));
    
        it("request should succeed", () => {
            return chakram
                .post("http://127.0.0.1:3001/users", { firstName: "Umed", lastName: "Khudoiberdiev" })
                .then((response: any) => {
                    expect(initializedUser).to.be.instanceOf(User);
                    expect(response).to.have.status(200);
                });
        });
    });

    describe("when useConstructorUtils is not set", () => {
    
        let app: any;
        before(done => app = createServer({ useConstructorUtils: false }).listen(3001, done));
        after(done => app.close(done));
    
        it("request should succeed", () => {
            return chakram
                .post("http://127.0.0.1:3001/users", { firstName: "Umed", lastName: "Khudoiberdiev" })
                .then((response: any) => {
                    expect(initializedUser).not.to.be.instanceOf(User);
                    expect(response).to.have.status(200);
                });
        });
    });

    describe("when routePrefix is used all controller routes should be appended by it", () => {
    
        let app: any;
        before(done => app = createServer({ routePrefix: "/api" }).listen(3001, done));
        after(done => app.close(done));
    
        it("request should succeed", () => {
            return chakram
                .post("http://127.0.0.1:3001/api/users", { firstName: "Umed", lastName: "Khudoiberdiev" })
                .then((response: any) => {
                    expect(response).to.have.status(200);
                });
        });
    });
    
});