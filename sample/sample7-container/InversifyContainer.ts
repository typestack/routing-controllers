import {IKernel} from 'inversify';
import {Container} from 'controllers.ts/ControllerRunner';

export default class InversifyContainer implements Container {
    
    constructor(private kernel: IKernel) {}
    
    get(someClass: any) {
        return this.kernel.get(someClass.name);
    }
}