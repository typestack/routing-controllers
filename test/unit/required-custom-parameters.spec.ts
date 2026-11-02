import { ActionParameterHandler } from '../../src/ActionParameterHandler';
import { createParamDecorator, ExpressDriver, Get, getMetadataArgsStorage, JsonController } from '../../src';
import { ParamRequiredError } from '../../src/error/ParamRequiredError';
import { MetadataBuilder } from '../../src/metadata-builder/MetadataBuilder';

describe('required custom parameters (#560)', () => {
  beforeEach(() => getMetadataArgsStorage().reset());

  function resolve(value: () => any, required: boolean = true) {
    const custom = createParamDecorator({ value, required });
    @JsonController()
    class Controller {
      @Get('/')
      get(@custom value: any) {
        return value;
      }
    }
    const param = new MetadataBuilder({}).buildControllerMetadata([Controller])[0].actions[0].params[0];
    return new ActionParameterHandler(new ExpressDriver()).handle(
      { request: { method: 'GET', url: '/' }, response: {} },
      param
    );
  }

  it.each([undefined, null, ''])('rejects a missing synchronous value: %p', async value => {
    await expect(resolve(() => value)).rejects.toBeInstanceOf(ParamRequiredError);
  });

  it.each([undefined, null, ''])('rejects a missing asynchronous value: %p', async value => {
    await expect(resolve(() => Promise.resolve(value))).rejects.toBeInstanceOf(ParamRequiredError);
  });

  it.each([0, false, { id: 1 }])('preserves a provided value: %p', async value => {
    await expect(resolve(() => value)).resolves.toBe(value);
    await expect(resolve(() => Promise.resolve(value))).resolves.toBe(value);
  });

  it('allows optional missing values and preserves factory rejections', async () => {
    await expect(resolve(() => undefined, false)).resolves.toBeUndefined();
    await expect(resolve(() => Promise.resolve(undefined), false)).resolves.toBeUndefined();
    const error = new Error('lookup failed');
    await expect(resolve(() => Promise.reject(error))).rejects.toBe(error);
  });
});
