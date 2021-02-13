import { HttpError } from '../../src/http-error/HttpError';
import { BadRequestError } from '../../src/http-error/BadRequestError';

describe('HttpError', () => {
  it('should be instance of HttpError and Error', () => {
    const error = new HttpError(418, 'Error message');
    expect(error.httpCode).toEqual(418);
    expect(error.message).toEqual('Error message');
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toBeInstanceOf(Error);
  });
});

describe('BadRequestError', () => {
  it('should be instance of BadRequestError, HttpError and Error', () => {
    const error = new BadRequestError('Error message');
    expect(error.httpCode).toEqual(400);
    expect(error.message).toEqual('Error message');
    expect(error).toBeInstanceOf(BadRequestError);
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toBeInstanceOf(Error);
  });
});
