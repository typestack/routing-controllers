import { IService, Data } from "./interfaces";
import { Service } from "typedi";

@Service("example.service.mock")
export class ExampleServiceMock implements IService {

    public getAll(): Promise<Data[]> {
        return new Promise<Data[]>((resolve, reject) => {
            resolve([{ id: 42, datas: "hey, im a mocked content" }]);
        });
    }

    public getOne(id: number): Promise<Data> {
        return new Promise<Data>((resolve, reject) => {
            resolve();
        });
    }
}