import "reflect-metadata";
import {MetadataBuilder} from "../../src/metadata-builder/MetadataBuilder";

import {Post} from "../../src/decorator/Post";
import {Controller} from "../../src";

const expect = require("chakram").expect;

describe("controller inheritance", () => {
    const metadataBuilder = new MetadataBuilder({});

    abstract class AbstractControllerTemplate {
        @Post()
        public create() {
        }
    }

    @Controller(`/derivative`)
    class DerivativeController extends AbstractControllerTemplate {
    }

    @Controller(`/autonomous`)
    class AutonomousController {
        @Post()
        public create() {
        }
    }


    it("should build empty meta for empty set", () => {
        const meta = metadataBuilder.buildControllerMetadata([]);

        expect(meta.length).to.be.eq(0);
    });

    it("should build meta if only derivative controller given", () => {
        const meta = metadataBuilder.buildControllerMetadata([
            DerivativeController,
        ]);

        expect(meta.length).to.be.eq(1);
        expect(meta[0].route).to.be.eq("/derivative");
        expect(meta[0].actions.length).to.be.eq(1);

        expect(meta[0].actions[0].method).to.be.eq("create");
        expect(meta[0].actions[0].type).to.be.eq("post");
    });

    it("should build meta if only autonomous controller given", () => {
        const meta = metadataBuilder.buildControllerMetadata([
            AutonomousController,
        ]);

        expect(meta.length).to.be.eq(1);
        expect(meta[0].route).to.be.eq("/autonomous");
        expect(meta[0].actions.length).to.be.eq(1);

        expect(meta[0].actions[0].method).to.be.eq("create");
        expect(meta[0].actions[0].type).to.be.eq("post");
    });

    it("should build meta if autonomous and derivative controllers given", () => {
        const meta = metadataBuilder.buildControllerMetadata([
            DerivativeController,
            AutonomousController,
        ]);

        expect(meta.length).to.be.eq(2);
        expect(meta[0].actions.length).to.be.eq(1);
        expect(meta[1].actions.length).to.be.eq(1);

        expect(meta[0].actions[0].method).to.be.eq("create");
        expect(meta[0].actions[0].type).to.be.eq("post");
        expect(meta[1].actions[0].method).to.be.eq("create");
        expect(meta[1].actions[0].type).to.be.eq("post");
    });

});
