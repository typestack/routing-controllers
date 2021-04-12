import {ActionParameterHandler} from "../src/ActionParameterHandler";
import {
  ActionMetadata,
  ControllerMetadata,
  ExpressDriver,
  ParamMetadata,
} from "../src";
import {ActionMetadataArgs} from "../src/metadata/args/ActionMetadataArgs";
import {ControllerMetadataArgs} from "../src/metadata/args/ControllerMetadataArgs";

const expect = require("chakram").expect;

describe("ActionParameterHandler", () => {

  it("handle method keeps string(UUID) parameters untouched", async () => {
    const driver = new ExpressDriver();
    const actionParameterHandler = new ActionParameterHandler(driver);

    const action = {
      request: {
        params: {
          id: "0b5ec98f-e26d-4414-b798-dcd35a5ef859"
        },
      },
      response: {}
    };

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

    const param: ParamMetadata = {
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

    const processedValue = await actionParameterHandler.handle(action, param);

    expect(processedValue).to.be.eq(action.request.params.id);
  });

});
