import {ActionParameterHandler} from "../src/ActionParameterHandler";
import {ActionMetadata, ControllerMetadata, ExpressDriver, ParamMetadata} from "../src";
import {ActionMetadataArgs} from "../src/metadata/args/ActionMetadataArgs";
import {ControllerMetadataArgs} from "../src/metadata/args/ControllerMetadataArgs";

const expect = require("chakram").expect;

describe("ActionParameterHandler", () => {
  const buildParamMetadata = (): ParamMetadata => {
    const controllerMetadataArgs: ControllerMetadataArgs = {
      target: function () {
      },
      route: "",
      type: "json",
      options: {},
    };
    const controllerMetadata = new ControllerMetadata(controllerMetadataArgs);
    const args: ActionMetadataArgs = {
      route: "",
      method: "getProduct",
      options: {},
      target: function () {
      },
      type: "get",
      appendParams: undefined,
    };
    const actionMetadata = new ActionMetadata(controllerMetadata, args, {});

    return {
      targetName: "product",
      isTargetObject: true,
      actionMetadata,
      target: () => {
      },
      method: "getProduct",
      object: "getProduct",
      extraOptions: undefined,
      index: 0,
      type: "param",
      name: "id",
      parse: undefined,
      required: false,
      transform: function (action, value) {
        return value;
      },
      classTransform: undefined,
      validate: undefined,
      targetType: function () {
      },
    };
  };

  it("handle - should process string parameters", async () => {
    const driver = new ExpressDriver();
    const actionParameterHandler = new ActionParameterHandler(driver);
    const param = buildParamMetadata();

    const action = {
      request: {
        params: {
          id: "0b5ec98f-e26d-4414-b798-dcd35a5ef859",
        },
      },
      response: {},
    };

    const processedValue = await actionParameterHandler.handle(action, param);

    expect(processedValue).to.be.eq(action.request.params.id);
  });

  it("handle - should process string parameters, returns empty if a given string is empty", async () => {
    const driver = new ExpressDriver();
    const actionParameterHandler = new ActionParameterHandler(driver);
    const param = buildParamMetadata();

    const action = {
      request: {
        params: {
          id: "",
        },
      },
      response: {},
    };

    const processedValue = await actionParameterHandler.handle(action, param);

    expect(processedValue).to.be.eq(action.request.params.id);
  });

  it("handle - should process number parameters", async () => {
    const driver = new ExpressDriver();
    const actionParameterHandler = new ActionParameterHandler(driver);
    const param = buildParamMetadata();

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

  it("handle - undefined on empty object provided", async () => {
    const driver = new ExpressDriver();
    const actionParameterHandler = new ActionParameterHandler(driver);
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
