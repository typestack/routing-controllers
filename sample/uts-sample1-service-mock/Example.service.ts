import { IService, Data } from "./interfaces";
import { Service } from "typedi";
import * as _ from "lodash";

@Service("example.service")
export class ExampleService implements IService {

    datas: Data[] = [
        {
            id: 1,
            datas: "content"
        },
        {
            id: 2,
            datas: "second content"
        }
    ];

    public getAll(): Promise<Data[]> {
        return new Promise<Data[]>((resolve, reject) => {
            resolve(this.datas);
        });
    }

    public getOne(id: number): Promise<Data> {
        return new Promise<Data>((resolve, reject) => {
            resolve(_.find(this.datas, (elmt) => elmt.id === id));
        });
    }
}