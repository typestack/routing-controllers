import "reflect-metadata";
import {Controller} from "../../src/decorator/controllers";
import {Get, Post, Put, Patch, Delete, Head, Method} from "../../src/decorator/methods";
import {createServer, defaultMetadataArgsStorage} from "../../src/index";
import {Param, QueryParam} from "../../src/decorator/params";
const chakram = require("chakram");
const expect = chakram.expect;

describe("Action Parameters > basic functionality", () => {
    describe("check @Get, @Post, @Put, @Patch, @Delete, @Head, custom response type, parameters in routes, promises", () => {

        let paramUserId: number, paramFirstId: number, paramSecondId: number;
        let queryParamSortBy: string, queryParamCount: string, queryParamLimit: number, queryParamShowAll: boolean;
        beforeEach(() => {
            paramUserId = undefined;
            paramFirstId = undefined;
            paramSecondId = undefined;
            queryParamSortBy = undefined;
            queryParamCount = undefined;
            queryParamLimit = undefined;
            queryParamShowAll = undefined;
        });
        
        before(() => {
    
            // reset metadata args storage
            defaultMetadataArgsStorage().reset();
    
            @Controller()
            class UserPhotoController {
                
                @Get("/users/:userId")
                getUser(@Param("userId") userId: number) {
                    paramUserId = userId;
                    return userId + "!";
                }

                @Get("/users/:firstId/photos/:secondId")
                getUserPhoto(@Param("firstId") firstId: number,
                             @Param("secondId") secondId: number) {
                    paramFirstId = firstId;
                    paramSecondId = secondId;
                    return firstId + "," + secondId;
                }

                @Get("/photos")
                getPhoto(@QueryParam("sortBy") sortBy: string,
                         @QueryParam("count") count: string,
                         @QueryParam("limit") limit: number,
                         @QueryParam("showAll") showAll: boolean) {
                    queryParamSortBy = sortBy;
                    queryParamCount = count;
                    queryParamLimit = limit;
                    queryParamShowAll = showAll;
                    return "";
                }
                
            }
    
        });
    
        let app: any;
        before(done => app = createServer().listen(3001, done));
        after(done => app.close(done));

        it("@Param should give a param from route", () => {
            return chakram
                .get("http://127.0.0.1:3001/users/1")
                .then((response: any) => {
                    paramUserId.should.be.eql(1);
                    expect(response).to.be.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("1!");
                });
        });

        it("multiple @Param should give a proper values from route", () => {
            return chakram
                .get("http://127.0.0.1:3001/users/23/photos/32")
                .then((response: any) => {
                    paramFirstId.should.be.eql(23);
                    paramSecondId.should.be.eql(32);
                    expect(response).to.be.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("23,32");
                });
        });

        it("@QueryParam should give a proper values from request query parameters", () => {
            return chakram
                .get("http://127.0.0.1:3001/photos?sortBy=name&count=2&limit=10&showAll=true")
                .then((response: any) => {
                    queryParamSortBy.should.be.eql("name");
                    queryParamCount.should.be.eql("2");
                    queryParamLimit.should.be.eql(10);
                    queryParamShowAll.should.be.eql(true);
                    expect(response).to.be.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                });
        });
        

    });
});