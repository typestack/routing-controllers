import {expect} from 'chai';
import {strictEqual, ok} from 'assert';
import {HttpError} from '../../src/http-error/HttpError';
import {BadRequestError} from '../../src/http-error/BadRequestError';

describe('using Error subclasses should be possible,', () => {
  describe('HttpError', () => {
    it('should be instance of HttpError and Error', () => {
      const error = new HttpError(418, 'Error message');
      strictEqual(error.httpCode, 418);
      strictEqual(error.message, 'Error message');
      ok(error instanceof HttpError);
      ok(error instanceof Error);
    });
  });
  describe('BadRequestError', () => {
    it('should be instance of BadRequestError, HttpError and Error', () => {
      const error = new BadRequestError('Error message');
      strictEqual(error.httpCode, 400);
      strictEqual(error.message, 'Error message');
      ok(error instanceof BadRequestError);
      ok(error instanceof HttpError);
      ok(error instanceof Error);
    });
  });
});
