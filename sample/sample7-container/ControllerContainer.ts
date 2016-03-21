import {Container} from '../../src/ControllerRunner';

export default class ControllerContainer implements Container {
    
    constructor(private map: any) {}
    
    get(someClass: any) {
        return this.map[someClass.name];
    }
}