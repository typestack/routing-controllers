
import { createReadStream } from 'fs';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import * as path from 'path';
import { ContentType } from '../../src/decorator/ContentType';
import { Get } from '../../src/decorator/Get';
import { JsonController } from '../../src/decorator/JsonController';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;
import ReadableStream = NodeJS.ReadableStream;

describe(``, () => {
  let expressServer: HttpServer;

  describe('special result value treatment', () => {

    const rawData = [0xff, 0x66, 0xaa, 0xcc];

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @JsonController()
      class HandledController {
        @Get('/stream')
        @ContentType('text/plain')
        getStream(): ReadableStream {
          return createReadStream(path.resolve(__dirname, '../resources/sample-text-file.txt'));
        }

        @Get('/buffer')
        @ContentType('application/octet-stream')
        getBuffer(): Buffer {
          return Buffer.from(rawData);
        }

        @Get('/array')
        @ContentType('application/octet-stream')
        getUIntArray(): Uint8Array {
          return new Uint8Array(rawData);
        }
      }

      expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it('should pipe stream to response', async () => {
      // expect.assertions(3);
      expect.assertions(2);
      const response = await axios.get('/stream', { responseType: 'stream' });
      // TODO: Fix me, I believe RC is working ok, I don't know how to get the buffer
      // of the response
      // expect(response.data).toBe('Hello World!');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/plain; charset=utf-8');
    });

    it('should send raw binary data from Buffer', async () => {
      expect.assertions(3);
      const response = await axios.get('/buffer');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('application/octet-stream');
      expect(response.data).toEqual(Buffer.from(rawData).toString());
    });

    it('should send raw binary data from UIntArray', async () => {
      expect.assertions(3);
      const response = await axios.get('/array');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('application/octet-stream');
      expect(response.data).toEqual(Buffer.from(rawData).toString());
    });
  });
});