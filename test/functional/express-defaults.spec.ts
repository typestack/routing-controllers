import "reflect-metadata";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {UseBefore} from "../../src/decorator/UseBefore";
import {Middleware} from "../../src/decorator/Middleware";
import {UseAfter} from "../../src/decorator/UseAfter";
import {NotAcceptableError} from "./../../src/http-error/NotAcceptableError";
import {ExpressErrorMiddlewareInterface} from "./../../src/driver/express/ExpressErrorMiddlewareInterface";
import { QueryParam } from '../../src/decorator/QueryParam';
import { OnUndefined } from '../../src/decorator/OnUndefined';
const chakram = require("chakram");
const expect = chakram.expect;

describe("express middlewares", () => {

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @Controller()
        class ExpressController {

            @Get("/voidfunc")
            voidfunc() { }

            @Get("/promisevoidfunc")
            promisevoidfunc() {
                return Promise.resolve();
            }

            @Get("/paramfunc")
            paramfunc(@QueryParam('x') x: number) {
                return { foo: 'bar' };
            }

            @Get("/nullfunc")
            nullfunc(): string {
                return null;
            }

            @Get("/overridefunc")
            @OnUndefined(404)
            overridefunc() { }

            @Get("/overrideparamfunc")
            overrideparamfunc(@QueryParam('x', { required: false }) x: number) {
                return { foo: 'bar' };
            }
        }
    });

    let defaultUndefinedResultCode = 204;
    let defaultNullResultCode = 404;
    let app: any;
    before(done => app = createExpressServer({
        defaults: {
            nullResultCode: defaultNullResultCode,
            undefinedResultCode: defaultUndefinedResultCode,
            paramOptions: {
                required: true
            }
        }
    }).listen(3001, done));
    after(done => app.close(done));

    it("should return undefinedResultCode from defaults config for void function", async () => {
        let res = await chakram.get("http://127.0.0.1:3001/voidfunc");
        expect(res).to.have.status(defaultUndefinedResultCode);
    });

    it("should return undefinedResultCode from defaults config for promise void function", async () => {
        let res = await chakram.get("http://127.0.0.1:3001/promisevoidfunc");
        expect(res).to.have.status(defaultUndefinedResultCode);
    });

    it("should return 400 from required paramOptions", async () => {
        let res = await chakram.get("http://127.0.0.1:3001/paramfunc");
        expect(res).to.have.status(400);
    });

    it("should return nullResultCode from defaults config", async () => {
        let res = await chakram.get("http://127.0.0.1:3001/nullfunc");
        expect(res).to.have.status(defaultNullResultCode);
    });

    it("should return status code from OnUndefined annotation", async () => {
        let res = await chakram.get("http://127.0.0.1:3001/overridefunc");
        expect(res).to.have.status(404);
    });

    it("should mark arg optional from QueryParam annotation", async () => {
        let res = await chakram.get("http://127.0.0.1:3001/overrideparamfunc");
        expect(res).to.have.status(200);
    });

});