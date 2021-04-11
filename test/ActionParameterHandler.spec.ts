import {ActionParameterHandler} from "../src/ActionParameterHandler";
import {
  Action,
  ActionMetadata,
  ControllerMetadata,
  createExpressServer,
  ParamMetadata,
  RoutingControllersOptions
} from "../src";
import {IncomingMessage} from "http";
import {ActionMetadataArgs} from "../src/metadata/args/ActionMetadataArgs";
import {ControllerMetadataArgs} from "../src/metadata/args/ControllerMetadataArgs";

const Socket = require("net").Socket;

const expect = require("chakram").expect;

describe("ActionParameterHandler", () => {

  it("handle", () => {

    const driver = createExpressServer();
    const actionParameterHandler = new ActionParameterHandler(driver);

    // console.log(actionParameterHandler);
    const socket = new Socket();
    const action = {
      request: new IncomingMessage(socket),
      response: new IncomingMessage(socket)
    };
    action.request.headers = {
      host: "0.0.0.0:3000",
      connection: "keep-alive",
      "cache-control": "max-age=0",
      "upgrade-insecure-requests": "1",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate",
      "accept-language": "en,en-US;q=0.9,da;q=0.8,de;q=0.7,es;q=0.6,fr;q=0.5,ru;q=0.4,nl;q=0.3,sv;q=0.2,sl;q=0.1,pt;q=0.1,ro;q=0.1,nb;q=0.1,it;q=0.1,uk;q=0.1,gl;q=0.1,la;q=0.1"
    };
    action.request.url = "/api/products/04879b32-c329-48d7-a652-818794b684f1";
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
      required: undefined,
      transform: function () {

      },
      classTransform: undefined,
      validate: undefined,
      targetType: function () {

      },
    };

    console.log(param);

    actionParameterHandler.handle(action, param);

  });
})
;
