import 'reflect-metadata';
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from '../../src/index';
import {assertRequest} from './test-utils';
import {Controller} from '../../src/decorator/Controller';
import {Get} from '../../src/decorator/Get';
const expect = require('chakram').expect;

describe('controller > base routes functionality', () => {
    before(() => {
        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @Controller('/posts')
        class PostController {
            @Get('/')
            public getAll() {
                return '<html><body>All posts</body></html>';
            }
            @Get(/\/categories\/(\d+)/)
            public getCategoryById() {
                return '<html><body>One post category</body></html>';
            }
            @Get('/:postId(\\d+)/users/:userId(\\d+)')
            public getPostById() {
                return '<html><body>One user</body></html>';
            }
            @Get('/:id(\\d+)')
            public getUserById() {
                return '<html><body>One post</body></html>';
            }
        }

    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    describe('get should respond with proper status code, headers and body content', () => {
        assertRequest([3001, 3002], 'get', 'posts', response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
            expect(response.body).to.be.equal('<html><body>All posts</body></html>');
        });
    });

    describe('get should respond with proper status code, headers and body content', () => {
        assertRequest([3001, 3002], 'get', 'posts/1', response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
            expect(response.body).to.be.equal('<html><body>One post</body></html>');
        });
    });

    describe('get should respond with proper status code, headers and body content', () => {
        assertRequest([3001, 3002], 'get', 'posts/1/users/2', response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header('content-type', 'text/html; charset=utf-8');
            expect(response.body).to.be.equal('<html><body>One user</body></html>');
        });
    });

    describe('wrong route should respond with 404 error', () => {
        assertRequest([3001, 3002], 'get', '1/users/1', response => {
            expect(response).to.have.status(404);
        });
    });

    describe('wrong route should respond with 404 error', () => {
        assertRequest([3001, 3002], 'get', 'categories/1', response => {
            expect(response).to.have.status(404);
        });
    });

    describe('wrong route should respond with 404 error', () => {
        assertRequest([3001, 3002], 'get', 'users/1', response => {
            expect(response).to.have.status(404);
        });
    });

});
