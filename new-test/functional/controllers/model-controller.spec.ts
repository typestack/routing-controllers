import ava from "ava";
import {bootstrap, getMetadataArgsStorage} from "../../../src/index";
import {TypeStackFramework} from "../../../src/TypeStackFramework";
import {Model} from "../../../src/decorator/Model";
import {ModelId} from "../../../src/decorator/ModelId";
import {ModelController} from "../../../src/decorator/ModelController";
import {GetOne} from "../../../src/decorator/GetOne";
import {GetMany} from "../../../src/decorator/GetMany";
import {GetManyAndCount} from "../../../src/decorator/GetManyAndCount";
import {Save} from "../../../src/decorator/Save";
import {Remove} from "../../../src/decorator/Remove";

// -------------------------------------------------------------------------
// Model
// -------------------------------------------------------------------------

@Model("user")
class User {

    @ModelId()
    id: number;

    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

}

// -------------------------------------------------------------------------
// Controller
// -------------------------------------------------------------------------

@ModelController(User)
class UserController {

    private users = [
        new User(1, "Timber Saw"),
        new User(2, "Visage"),
        new User(3, "Phantom Lancer"),
    ];

    @GetMany()
    all() {
        return this.users;
    }

    @GetManyAndCount()
    allAndCount() {
        return [this.users, this.users.length];
    }

    @GetOne()
    one(id: number) {
        return this.users.find(user => user.id === id);
    }

    @Save()
    save(user: User) {
        return this.users.push(new User(user.id, user.name));
    }

    @Remove()
    remove(id: number) {
        const user = this.users.find(user => user.id === id);
        if (!user) return;

        this.users.splice(this.users.indexOf(user), 1);
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

/*

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
*/
