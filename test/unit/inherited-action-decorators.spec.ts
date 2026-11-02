import { ActionParameterHandler } from '../../src/ActionParameterHandler';
import {
  Body,
  ExpressDriver,
  getMetadataArgsStorage,
  HttpCode,
  JsonController,
  Param,
  Post,
  Req,
  UseBefore,
  UseInterceptor,
} from '../../src';
import { MetadataBuilder } from '../../src/metadata-builder/MetadataBuilder';

describe('inherited action decorators (#1538)', () => {
  beforeEach(() => getMetadataArgsStorage().reset());

  it('injects inherited parameters and retains method decorators for sibling controllers', async () => {
    const middleware = (_request: any, _response: any, next: () => void) => next();
    const interceptor = (_action: any, result: any) => result;
    class Base {
      label = 'base';

      @Post('/:id')
      @HttpCode(201)
      @UseBefore(middleware)
      @UseInterceptor(interceptor)
      save(@Param('id') id: string, @Body() body: object, @Req() request: any) {
        return { id, body, method: request.method, label: this.label };
      }
    }
    class Intermediate extends Base {}
    @JsonController('/first')
    class First extends Intermediate {
      label = 'first';
    }
    @JsonController('/second')
    class Second extends Base {
      label = 'second';
    }

    const controllers = new MetadataBuilder({}).buildControllerMetadata([First, Second]);
    for (const [index, controller] of controllers.entries()) {
      const action = controller.actions[0];
      expect(action.params.map(param => param.type).sort()).toEqual(['body', 'param', 'request']);
      expect(action.isBodyUsed).toBe(true);
      expect(action.successHttpCode).toBe(201);
      expect(action.uses[0].middleware).toBe(middleware);
      expect(action.interceptors[0].interceptor).toBe(interceptor);
      expect(action.target).toBe(controller.target);
      const request = { method: 'POST', params: { id: '42' }, body: { value: 1 } };
      const handler = new ActionParameterHandler(new ExpressDriver());
      const params = await Promise.all(
        action.params
          .slice()
          .sort((a, b) => a.index - b.index)
          .map(param => handler.handle({ request, response: {} }, param))
      );
      expect(action.callMethod(params, { request, response: {} })).toEqual({
        id: '42',
        body: { value: 1 },
        method: 'POST',
        label: index === 0 ? 'first' : 'second',
      });
    }
    expect(getMetadataArgsStorage().actions[0].target).toBe(Base);
  });

  it('uses the nearest decorated override without inheriting the base signature', () => {
    class Base {
      @Post('/base/:id')
      @HttpCode(201)
      save(@Param('id') value: any) {
        return value;
      }
    }
    @JsonController('/child')
    class Child extends Base {
      @Post('/override')
      @HttpCode(202)
      save(@Body() value: any) {
        return value;
      }
    }
    const actions = new MetadataBuilder({}).buildControllerMetadata([Child])[0].actions;
    expect(actions).toHaveLength(1);
    expect(actions[0].route).toBe('/override');
    expect(actions[0].successHttpCode).toBe(202);
    expect(actions[0].params.map(param => param.type)).toEqual(['body']);
  });
});
