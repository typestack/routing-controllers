import {IKernel} from 'inversify';
import {Container} from '../src/ControllerRunner';

export default class InversifyContainer implements Container {
    
    constructor(private kernel: IKernel) {}
    
    get(someClass: any) {
        return this.kernel.get(someClass.name);
    }
}