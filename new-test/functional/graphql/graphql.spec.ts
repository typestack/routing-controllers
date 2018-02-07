import {bootstrap} from "../../../src/index";
import {User} from "./entity/User";
import {Photo} from "./entity/Photo";
import {Album} from "./entity/Album";

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

// let framework: TypeStackFramework;
// ava.before(async () => {
bootstrap({
    port: 4000,
    controllers: [__dirname + "/controller/*{.ts,.js}"],
    resolvers: [__dirname + "/resolver/*{.ts,.js}"],
    schemas: [__dirname + "/schema/*"],
}).then(async framework => {

    // insert dummy data
    const manager = framework.ormConnection.manager;

    const user1 = new User("Timber", "Saw");
    const user2 = new User("Phantom", "Assassin");
    const user3 = new User("Phantom", "Lancer");
    await manager.save([user1, user2, user3]);

    const album1 = new Album("Demo photos");
    const album2 = new Album("My photos");
    await manager.save([album1, album2]);

    const photo1 = new Photo("1_1.jpg", user1, [album1, album2]);
    const photo2 = new Photo("1_2.jpg", user1, [album1, album2]);
    const photo3 = new Photo("1_3.jpg", user1, [album1]);
    const photo4 = new Photo("2_1.jpg", user2, [album1]);
    const photo5 = new Photo("3_1.jpg", user3, [album2]);
    const photo6 = new Photo("3_2.jpg", user3);
    await manager.save([photo1, photo2, photo3, photo4, photo5, photo6]);

    console.log("Server is up and running");
});
// });
// ava.after(async () => {
//     await framework.stop();
//     getMetadataArgsStorage().reset();
// });

// -------------------------------------------------------------------------
// Tests
// -------------------------------------------------------------------------

/*ava("GET requests to controllers must work", async test => {
    const response = await get("/users");
    test.is(response.statusCode, 200);
    test.is(response.body, "Hello from all users");
});*/
