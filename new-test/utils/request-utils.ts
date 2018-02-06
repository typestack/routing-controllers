import * as request from "request-promise";

export function get(route: string): Promise<any> {
    return request.get("http://127.0.0.1:3001" + route, {
        resolveWithFullResponse: true
    }) as any;
}

export function post(route: string): Promise<any> {
    return request.post("http://127.0.0.1:3001" + route, {
        resolveWithFullResponse: true
    }) as any;
}

export function put(route: string): Promise<any> {
    return request.put("http://127.0.0.1:3001" + route, {
        resolveWithFullResponse: true
    }) as any;
}

export function del(route: string): Promise<any> {
    return request.delete("http://127.0.0.1:3001" + route, {
        resolveWithFullResponse: true
    }).then(response => response).catch(error => error) as any;
}