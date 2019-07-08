import 'reflect-metadata';
import {ok, strictEqual} from 'assert';
import {createReadStream} from 'fs';
import * as path from 'path';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {assertRequest} from './test-utils';
import {JsonController} from '../../src/decorator/JsonController';
import {Get} from '../../src/decorator/Get';
import {ContentType} from '../../src/decorator/ContentType';

describe('special result value treatment', () => {
  const rawData = [0xff, 0x66, 0xaa, 0xcc];

  before(() => {
    // reset metadata args storage
    getMetadataArgsStorage().reset();

    @JsonController()
    class HandledController {
      @Get('/buffer')
      @ContentType('application/octet-stream')
      public getBuffer() {
        return new Buffer(rawData);
      }

      @Get('/stream')
      @ContentType('text/plain')
      public getStream() {
        const pathStr = path.resolve(__dirname, '../../test/resources/sample-text-file.txt');
        return createReadStream(pathStr);
      }

      @Get('/array')
      @ContentType('application/octet-stream')
      public getUIntArray() {
        return new Uint8Array(rawData);
      }
    }
  });

  let expressApp: any, koaApp: any;
  before(done => (expressApp = createExpressServer().listen(3001, done)));
  after(done => expressApp.close(done));
  before(done => (koaApp = createKoaServer().listen(3002, done)));
  after(done => koaApp.close(done));

  describe('should pipe stream to response', () => {
    assertRequest([3001, 3002], 'get', 'stream', response => {
      strictEqual(response.response.statusCode, 200);
      ok(response.response.headers['content-type'].match(/text\/plain/));
      strictEqual(response.body, 'Hello World!');
    });
  });

  describe('should send raw binary data from Buffer', () => {
    assertRequest([3001, 3002], 'get', 'buffer', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'application/octet-stream');
      strictEqual(response.body, new Buffer(rawData).toString());
    });
  });

  describe('should send raw binary data from UIntArray', () => {
    assertRequest([3001, 3002], 'get', 'array', response => {
      strictEqual(response.response.statusCode, 200);
      strictEqual(response.response.headers['content-type'], 'application/octet-stream');
      strictEqual(response.body, Buffer.from(rawData).toString());
    });
  });
});
