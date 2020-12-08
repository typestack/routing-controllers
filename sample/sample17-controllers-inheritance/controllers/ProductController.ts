import { Controller } from '../../../src/decorator/Controller';
import { AbstractControllerTemplate } from './AbstractContollerTemplate';
import { MockedRepository } from '../repository/MockedRepository';

const domain = 'product';

@Controller(`/${domain}`)
export class ProductController extends AbstractControllerTemplate {
  protected constructor() {
    super();

    this.domain = domain;
    this.repository = new MockedRepository(domain);
  }
}
