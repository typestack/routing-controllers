import ava from "ava";
import {bootstrap, getMetadataArgsStorage} from "../../../src/index";
import {del, get, post, put} from "../../utils/request-utils";
import {TypeStackFramework} from "../../../src/TypeStackFramework";
import {Delete, Get, JsonController, Post, Put} from "../../../src";

// -------------------------------------------------------------------------
// Controller
// -------------------------------------------------------------------------

@JsonController()
class UserController {

    @Get("/users")
    all() {
        return [
            { id: 1, name: "Timber Saw" },
            { id: 2, name: "Visage" },
            { id: 3, name: "Phantom Lancer" },
        ];
    }

    @Post("/users")
    post() {
        return { status: "inserted" };
    }

    @Put("/users")
    put() {
        return { status: "updated" };
    }

    @Delete("/users/:id")
    delete() {
        return { status: "removed" };
    }

}

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

let framework: TypeStackFramework;
ava.before(async () => {
    framework = await bootstrap({
        port: 3001,
        controllers: [UserController]
    });
});
ava.after(async () => {
    await framework.stop();
    getMetadataArgsStorage().reset();
});

// -------------------------------------------------------------------------
// Tests
// -------------------------------------------------------------------------

ava("GET requests to controllers must work", async test => {
    const response = await get("/users");
    test.is(response.statusCode, 200);
    test.is(response.headers["content-type"], "application/json; charset=utf-8");
    test.deepEqual(JSON.parse(response.body), [
        { id: 1, name: "Timber Saw" },
        { id: 2, name: "Visage" },
        { id: 3, name: "Phantom Lancer" },
    ]);
});

ava("POST requests to controllers must work", async test => {
    const response = await post("/users");
    test.is(response.statusCode, 200);
    test.is(response.headers["content-type"], "application/json; charset=utf-8");
    test.deepEqual(JSON.parse(response.body), { status: "inserted" });
});

ava("PUT requests to controllers must work", async test => {
    const response = await put("/users");
    test.is(response.statusCode, 200);
    test.is(response.headers["content-type"], "application/json; charset=utf-8");
    test.deepEqual(JSON.parse(response.body), { status: "updated" });
});

ava("DELETE requests to controllers must work", async test => {
    const response = await del("/users/1");
    test.is(response.statusCode, 200);
    test.is(response.headers["content-type"], "application/json; charset=utf-8");
    test.deepEqual(JSON.parse(response.body), { status: "removed" });
});

ava("non exist controllers must give an error", async test => {
    const response = await del("/users");
    // test.is(response.headers["content-type"], "application/json; charset=utf-8");
    test.is(response.response.headers["content-type"], "text/html; charset=utf-8"); // todo: fix
    test.is(response.statusCode, 404);
});
