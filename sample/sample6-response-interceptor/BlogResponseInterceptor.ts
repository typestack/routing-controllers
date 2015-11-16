import {JsonController, Get, ResponseInterceptor} from "../../src/Annotations";
import {ForbiddenError} from "../../src/error/http/ForbiddenError";
import {ResponseInterceptorInterface} from "../../src/ResponseInterceptorInterface";
import {Request, Response} from "express";

@ResponseInterceptor()
export class BlogResponseInterceptor implements ResponseInterceptorInterface {

    onSend(data: string, request: Request, response: Response): any {
        return data.toLowerCase();
    }

    onJson(data: any, request: Request, response: Response): any {
        if (data instanceof Array)
            return data.map((object: any) => this.replaceObjectKeys(object));
        else if (data instanceof Object)
            return this.replaceObjectKeys(data);

        return data;
    }

    private replaceObjectKeys(object: any): any {
        return Object.keys(object).reduce((obj: any, key: string) => {
            const underscoredKey = key.replace(/\.?([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
            obj[underscoredKey] = object[key];
            return obj;
        }, {});
    }

}