import {ExpressMiddlewareInterface} from '../../../../../src/driver/express/ExpressMiddlewareInterface';

export class BlogMiddleware implements ExpressMiddlewareInterface {

    public use(request: any, response: any, next?: Function): any {
        console.log('logging request from blog middleware...');
        next('ERROR IN BLOG MIDDLEWARE');
        // console.log("extra logging request from blog middleware...");
    }

}
