import ava from "ava";
import {bootstrap, getMetadataArgsStorage} from "../../../src/index";
import {del, get, post, put} from "../../utils/request-utils";
import {TypeStackFramework} from "../../../src/TypeStackFramework";
import {Controller, Delete, Get, Post, Put} from "../../../src";

// -------------------------------------------------------------------------
// Controller
// -------------------------------------------------------------------------

@Controller()
class UserController {

    @Get("/users")
    all() {
        return "Hello from all users";
    }

    @Post("/users")
    post() {
        return "User inserted";
    }

    @Put("/users")
    put() {
        return "User updated";
    }

    @Delete("/users/:id")
    delete() {
        return "User deleted";
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
    test.is(response.body, "Hello from all users");
});

ava("POST requests to controllers must work", async test => {
    const response = await post("/users");
    test.is(response.statusCode, 200);
    test.is(response.body, "User inserted");
});

ava("PUT requests to controllers must work", async test => {
    const response = await put("/users");
    test.is(response.statusCode, 200);
    test.is(response.body, "User updated");
});

ava("DELETE requests to controllers must work", async test => {
    const response = await del("/users/1");
    test.is(response.statusCode, 200);
    test.is(response.body, "User deleted");
});

ava("non exist controllers must give an error", async test => {
    const response = await del("/users");
    test.is(response.statusCode, 404);
});
