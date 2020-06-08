import {Controller} from "../../../src/decorator/Controller";
import {AbstractControllerTemplate} from "./AbstractContollerTemplate";
import {MockedRepository} from "../repository/MockedRepository";

const domain = "category";

@Controller(`/${domain}`)
export class CategoryController extends AbstractControllerTemplate {
  protected constructor() {
    super();

    this.domain = domain;
    this.repository = new MockedRepository(domain);
  }
}
