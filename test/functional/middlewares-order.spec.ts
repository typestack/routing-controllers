import "reflect-metadata";
import {bootstrap, getMetadataArgsStorage} from "../../src/index";
import {MiddlewareInterface} from "../../src/interface/MiddlewareInterface";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";

const chakram = require("chakram");
const expect = chakram.expect;

describe("order of middlewares", () => {

    describe("loaded direct from array", () => {
        
        let middlewaresOrder: number[];
    
        beforeEach(() => {
            middlewaresOrder = [];
        });
        
        let app: any;
        before(done => {
    
            // reset metadata args storage
            getMetadataArgsStorage().reset();
    
            class ThirdAfterMiddleware implements MiddlewareInterface {
            
                use(request: any, response: any, next: (err?: any) => any) {
                    middlewaresOrder.push(3);
                    next();
                }
                
            }
            
            class FirstAfterMiddleware implements MiddlewareInterface {
            
                use(request: any, response: any, next: (err?: any) => any) {
                    middlewaresOrder.push(1);
                    next();
                }
                
            }

            class SecondAfterMiddleware implements MiddlewareInterface {
            
                use(request: any, response: any, next: (err?: any) => any) {
                    middlewaresOrder.push(2);
                    next();
                }
                
            }
    
            @Controller()
            class ExpressMiddlewareController {
    
                @Get("/test")
                test() {
                    return "OK";
                }
    
            }
    
            app = bootstrap({
                middlewares: [FirstAfterMiddleware, SecondAfterMiddleware, ThirdAfterMiddleware]
            }).listen(3001, done);
        });
    
        after(done => app.close(done));
    
        it("should call middlewares in order defined by items order", () => {
            return chakram
                .get("http://127.0.0.1:3001/test")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(middlewaresOrder[0]).to.equal(1);
                    expect(middlewaresOrder[1]).to.equal(2);
                    expect(middlewaresOrder[2]).to.equal(3);
                });
        });
    
    });
    
    describe("specified by priority option", () => {
        
        let middlewaresOrder: number[];
    
        beforeEach(() => {
            middlewaresOrder = [];
        });
        
        let app: any;
        before(done => {
    
            // reset metadata args storage
            getMetadataArgsStorage().reset();
    
            class ThirdAfterMiddleware implements MiddlewareInterface {
            
                use(request: any, response: any, next: (err?: any) => any) {
                    middlewaresOrder.push(3);
                    next();
                }
                
            }
            
            class FirstAfterMiddleware implements MiddlewareInterface {
            
                use(request: any, response: any, next: (err?: any) => any) {
                    middlewaresOrder.push(1);
                    next();
                }
                
            }
    
            class SecondAfterMiddleware implements MiddlewareInterface {
            
                use(request: any, response: any, next: (err?: any) => any) {
                    middlewaresOrder.push(2);
                    next();
                }
                
            }
    
            @Controller()
            class ExpressMiddlewareController {
    
                @Get("/test")
                test() {
                    return "OK";
                }
    
            }
    
            app = bootstrap({
                middlewares: [SecondAfterMiddleware, ThirdAfterMiddleware, FirstAfterMiddleware]
            }).listen(3001, done);
        });
    
        after(done => app.close(done));
    
        it("should call middlewares in order defined by priority parameter of decorator", () => {
            return chakram
                .get("http://127.0.0.1:3001/test")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(middlewaresOrder[0]).to.equal(1);
                    expect(middlewaresOrder[1]).to.equal(2);
                    expect(middlewaresOrder[2]).to.equal(3);
                });
        });
    });

});
