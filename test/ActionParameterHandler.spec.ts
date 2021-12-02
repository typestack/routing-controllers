import { ActionParameterHandler } from '../src/ActionParameterHandler';
import { ActionMetadata, ControllerMetadata, ExpressDriver, ParamMetadata } from '../src';
import { ActionMetadataArgs } from '../src/metadata/args/ActionMetadataArgs';
import { ControllerMetadataArgs } from '../src/metadata/args/ControllerMetadataArgs';
import { ParamType } from '../src/metadata/types/ParamType';

const expect = require('chakram').expect;

describe('ActionParameterHandler', () => {
  const buildParamMetadata = (
    name: string = 'id',
    type: ParamType = 'param',
    isRequired: boolean = false
  ): ParamMetadata => {
    const controllerMetadataArgs: ControllerMetadataArgs = {
      target: function () {},
      route: '',
      type: 'json',
      options: {},
    };
    const controllerMetadata = new ControllerMetadata(controllerMetadataArgs);
    const args: ActionMetadataArgs = {
      route: '',
      method: 'getProduct',
      options: {},
      target: function () {},
      type: 'get',
      appendParams: undefined,
    };
    const actionMetadata = new ActionMetadata(controllerMetadata, args, {});

    return {
      type,
      name,
      targetName: 'product',
      isTargetObject: true,
      actionMetadata,
      target: () => {},
      method: 'getProduct',
      object: 'getProduct',
      extraOptions: undefined,
      index: 0,
      parse: undefined,
      required: isRequired,
      transform: function (action, value) {
        return value;
      },
      classTransform: undefined,
      validate: undefined,
      targetType: function () {},
    };
  };
  const driver = new ExpressDriver();
  const actionParameterHandler = new ActionParameterHandler(driver);

  describe('positive', () => {
    it('handle - should process string parameters', async () => {
      const param = buildParamMetadata('uuid');
      const action = {
        request: {
          params: {
            uuid: '0b5ec98f-e26d-4414-b798-dcd35a5ef859',
          },
        },
        response: {},
      };

      const processedValue = await actionParameterHandler.handle(action, param);

      expect(processedValue).to.be.eq(action.request.params.uuid);
    });

    it('handle - should process string parameters, returns empty if a given string is empty', async () => {
      const param = buildParamMetadata('uuid');
      const action = {
        request: {
          params: {
            uuid: '',
          },
        },
        response: {},
      };

      const processedValue = await actionParameterHandler.handle(action, param);

      expect(processedValue).to.be.eq(action.request.params.uuid);
    });

    it('handle - should process number parameters', async () => {
      const param = buildParamMetadata('id');
      const action = {
        request: {
          params: {
            id: 10000,
          },
        },
        response: {},
      };

      const processedValue = await actionParameterHandler.handle(action, param);

      expect(processedValue).to.be.eq(action.request.params.id);
    });

    it('handle - undefined on empty object provided', async () => {
      const param = buildParamMetadata();
      const action = {
        request: {
          params: {},
        },
        response: {},
      };

      const processedValue = await actionParameterHandler.handle(action, param);

      expect(processedValue).to.be.eq(undefined);
    });
  });
  describe('negative', () => {
    it('handle - throws error if the parameter is required', async () => {
      const param = buildParamMetadata('uuid', 'param', true);
      const action = {
        request: {},
        response: {},
      };
      let error;

      try {
        await actionParameterHandler.handle(action, param);
      } catch (e) {
        error = e;
      }

      expect(error.toString()).to.be.eq("TypeError: Cannot read property 'uuid' of undefined");
    });

    it('handle - throws error if the parameter is required, type file provided', async () => {
      const param = buildParamMetadata('uuid', 'file', true);
      const action = {
        request: {},
        response: {},
      };
      let error;

      try {
        await actionParameterHandler.handle(action, param);
      } catch (e) {
        error = e;
      }

      expect(error.httpCode).to.be.eq(400);
      expect(error.name).to.be.eq('ParamRequiredError');
      expect(error.message).to.be.eq('Uploaded file "uuid" is required for request on undefined undefined');
    });
  });
});
