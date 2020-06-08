import {IInstance} from "../interface/IInstance";
import {IPayload} from "../interface/IPayload";

export class MockedRepository {
  protected domain: string;

  constructor(domain: string) {
    this.domain = domain;
  }

  public getCollection(): Promise<IInstance[]> {
    return Promise.resolve([
      {
        id: 10020,
        type: this.domain
      },
      {
        id: 10001,
        type: this.domain
      },
      {
        id: 10002,
        type: this.domain
      },
    ]);
  }

  public create(payload: IPayload): Promise<IInstance> {
    return Promise.resolve(
      {
        id: 10000,
        type: this.domain
      }
    );
  }

  public find(id: number): Promise<IInstance> {
    return Promise.resolve(
      {
        id: id,
        type: this.domain
      }
    );
  }

  public delete(id: number): Promise<void> {
    return Promise.resolve();
  }

  public update(id: number, payload: IPayload): Promise<IInstance> {
    return Promise.resolve(
      {
        id: 10000,
        type: this.domain
      }
    );
  }

}

