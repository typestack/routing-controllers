import {Res} from "../../../src/decorator/Res";
import {Put} from "../../../src/decorator/Put";
import {Post} from "../../../src/decorator/Post";
import {Param} from "../../../src/decorator/Param";
import {Get} from "../../../src/decorator/Get";
import {Delete} from "../../../src/decorator/Delete";
import {Body} from "../../../src/decorator/Body";

import {MockedRepository} from "../repository/MockedRepository";
import {IInstance} from "../interface/IInstance";

/**
 * @description the base controller class used by derivatives
 */
export abstract class AbstractControllerTemplate {
  /**
   * @description domain part of a system, also called object|entity|model
   */
  protected domain: string;
  protected repository: MockedRepository;

  @Post()
  public async create(
    @Body() payload: any,
    @Res() res: any
  ): Promise<{}> {
    const item = await this.repository.create(payload);

    res.status(201);
    res.location(`/${this.domain}/${item.id}`);

    return {};
  }

  @Put("/:id")
  public async updated(
    @Param("id") id: number,
    @Body() payload: any,
    @Res() res: any
  ): Promise<{}> {
    await this.repository.update(id, payload);
    res.status(204);

    return {};
  }

  @Get("/:id")
  public read(
    @Param("id") id: number,
    @Res() res: any
  ): Promise<IInstance> {
    return this.repository.find(id);
  }

  @Get()
  public readCollection(
    @Res() res: any
  ): Promise<IInstance[]> {
    return this.repository.getCollection();
  }

  @Delete("/:id")
  public async delete(
    @Param("id") id: number,
    @Res() res: any
  ): Promise<{}> {
    await this.repository.delete(id);

    return {};
  }
}
