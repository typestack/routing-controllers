import {IInstance} from "../interface/IInstance";
import {IPayload} from "../interface/IPayload";

export class MockedRepository {
  protected domain: string;

  constructor(domain: string) {
    this.domain = domain;
  }

  /**
   * @description Dummy method to return collection of items
   */
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

  /**
   * @description Dummy method to create a new item in storage and return its instance
   */
  public create(payload: IPayload): Promise<IInstance> {
    return Promise.resolve(
      {
        id: 10000,
        type: this.domain
      }
    );
  }

  /**
   * @description Dummy method to find item in storage
   */
  public find(id: number): Promise<IInstance> {
    return Promise.resolve(
      {
        id: id,
        type: this.domain
      }
    );
  }

  /**
   * @description Dummy method to delete item in storage by id
   */
  public delete(id: number): Promise<void> {
    return Promise.resolve();
  }

  /**
   * @description Dummy method to update item in storage by id
   */
  public update(id: number, payload: IPayload): Promise<IInstance> {
    return Promise.resolve(
      {
        id: 10000,
        type: this.domain
      }
    );
  }

}

