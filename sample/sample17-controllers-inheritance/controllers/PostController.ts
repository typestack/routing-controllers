import {JsonController} from "../../../src/decorator/JsonController";
import {BaseController, BaseControllerClass} from "./BaseController";

@JsonController("/posts")
export class PostController extends BaseController("post") {}