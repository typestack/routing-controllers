import {RequestMap, QueryParam, Param, Body} from "../../../../../../src";
import {Photo} from "../entity/Photo";

@RequestMap("PhotoListRequest")
export class PhotoListRequest {

    @Param()
    id?: string;

    @QueryParam()
    keyword?: string;

    @QueryParam()
    limit?: number;

    @QueryParam()
    offset?: number;

    @Body()
    photo?: Photo;

} // photos?filter={keyword: "", ...}
// photos?keyword=""...&limit=""...&...