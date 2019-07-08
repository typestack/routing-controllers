import {JsonController} from '../../src/decorator/JsonController';
import {Get} from '../../src/decorator/Get';
import {ForbiddenError} from '../../src/http-error/ForbiddenError';

export class ValidationError extends Error {
  public errors = ['blank', 'minLength', 'maxLength'];
  public message = 'Validation Error!';
  public name = 'ValidationError';
}

@JsonController()
export class BlogController {
  @Get('/blogs')
  public getAll() {
    throw new ForbiddenError('Nooooo this message will be lost');
  }

  @Get('/blogs/:id')
  public getOne() {
    throw new ValidationError();
  }
}
