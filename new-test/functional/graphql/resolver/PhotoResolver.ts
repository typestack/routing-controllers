import {Resolver} from "../../../../src/decorator/Resolver";
import {ResolverInterface} from "../../../../src/interface/ResolverInterface";
import {Photo} from "../entity/Photo";

@Resolver(Photo)
export class PhotoResolver implements ResolverInterface<Photo> {

}