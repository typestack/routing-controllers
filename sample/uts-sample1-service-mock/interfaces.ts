export type Data = {id: number, datas: string};

export interface IService {
    getAll(): Promise<Data[]>;
    getOne(id: number): Promise<Data>;
}
