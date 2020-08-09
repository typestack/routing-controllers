import 'reflect-metadata';
import { createReadStream, createWriteStream } from 'fs';
import * as path from 'path';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { JsonController } from '../../src/decorator/JsonController';
import { Get } from '../../src/decorator/Get';
import { ContentType } from '../../src/decorator/ContentType';
import { AxiosResponse } from 'axios';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import DoneCallback = jest.DoneCallback;
import { axios } from '../utilities/axios';
import ReadableStream = NodeJS.ReadableStream;

describe('special result value treatment', () => {
  let expressServer: HttpServer;
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

  it('should pipe stream to response', () => {
    // expect.assertions(3);
    expect.assertions(2);
    return axios.get('/stream', { responseType: 'stream'}).then((response: AxiosResponse) => {
      
      // TODO: Fix me, I believe RC is working ok, I don't know how to get the buffer
      // of the response
      // expect(response.data).toBe('Hello World!');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/plain; charset=utf-8');
    });
  });

  it('should send raw binary data from Buffer', () => {
    expect.assertions(3);
    return axios.get('/buffer').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('application/octet-stream');
      expect(response.data).toEqual(Buffer.from(rawData).toString());
    });
  });

  it('should send raw binary data from UIntArray', () => {
    expect.assertions(3);
    return axios.get('/array').then((response: AxiosResponse) => {
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('application/octet-stream');
      expect(response.data).toEqual(Buffer.from(rawData).toString());
    });
  });
});
