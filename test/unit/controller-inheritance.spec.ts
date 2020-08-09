import 'reflect-metadata';
import { MetadataBuilder } from '../../src/metadata-builder/MetadataBuilder';
import { Controller, getMetadataArgsStorage, Post } from '../../src';

const expect = require('chakram').expect;

describe('controller inheritance', () => {
  it('should build empty meta for empty set', () => {
    // Reset storage
    getMetadataArgsStorage().reset();
    const metadataBuilder = new MetadataBuilder({});
    const meta = metadataBuilder.buildControllerMetadata([]);

    expect(meta.length).to.be.eq(0);
  });

  it('should build meta if the only derivative controller is given', () => {
    // Reset storage
    getMetadataArgsStorage().reset();

    // Persist storage from decorators
    abstract class AbstractControllerTemplate {
      @Post()
      public create() {}
    }

    @Controller(`/derivative`)
    class DerivativeController extends AbstractControllerTemplate {}

    @Controller(`/autonomous`)
    class AutonomousController {
      @Post()
      public create() {}
    }

    // Build controllers
    const metadataBuilder = new MetadataBuilder({});
    const meta = metadataBuilder.buildControllerMetadata([DerivativeController]);

    expect(meta.length).to.be.eq(1);
    expect(meta[0].route).to.be.eq('/derivative');
    expect(meta[0].actions.length).to.be.eq(1);

    expect(meta[0].actions[0].method).to.be.eq('create');
    expect(meta[0].actions[0].type).to.be.eq('post');
  });

  it('should build meta if the only autonomous controller is given', () => {
    getMetadataArgsStorage().reset();

    // Persist storage from decorators
    abstract class AbstractControllerTemplate {
      @Post()
      public create() {}
    }

    @Controller(`/derivative`)
    class DerivativeController extends AbstractControllerTemplate {}

    @Controller(`/autonomous`)
    class AutonomousController {
      @Post()
      public create() {}
    }

    // Build controllers
    const metadataBuilder = new MetadataBuilder({});
    const meta = metadataBuilder.buildControllerMetadata([AutonomousController]);

    expect(meta.length).to.be.eq(1);
    expect(meta[0].route).to.be.eq('/autonomous');
    expect(meta[0].actions.length).to.be.eq(1);

    expect(meta[0].actions[0].method).to.be.eq('create');
    expect(meta[0].actions[0].type).to.be.eq('post');
  });

  it('should build meta both when autonomous and derivative controllers are given', () => {
    getMetadataArgsStorage().reset();

    // Persist storage from decorators
    abstract class AbstractControllerTemplate {
      @Post()
      public create() {}
    }

    @Controller(`/derivative`)
    class DerivativeController extends AbstractControllerTemplate {}

    @Controller(`/autonomous`)
    class AutonomousController {
      @Post()
      public create() {}
    }

    // Build controllers
    const metadataBuilder = new MetadataBuilder({});
    const meta = metadataBuilder.buildControllerMetadata();

    expect(meta.length).to.be.eq(2);
    expect(meta[0].actions.length).to.be.eq(1);
    expect(meta[1].actions.length).to.be.eq(1);

    expect(meta[0].actions[0].method).to.be.eq('create');
    expect(meta[0].actions[0].type).to.be.eq('post');
    expect(meta[1].actions[0].method).to.be.eq('create');
    expect(meta[1].actions[0].type).to.be.eq('post');
  });
});
