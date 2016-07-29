const chakram = require("chakram");

export function assertRequest(ports: number[], method: string, route: string, callback: (response: any) => any): void;
export function assertRequest(ports: number[], method: string, route: string, dataOrOptions: any, callback: (response: any) => any): void;
export function assertRequest(ports: number[], method: string, route: string, data: any, requestOptions: any, callback: (response: any) => any): void;
export function assertRequest(ports: number[],
                              method: string,
                              route: string,
                              dataOrCallback: any|((response: any) => any),
                              dataOrRequestOptionsOrCallback?: any|((response: any) => any),
                              maybeCallback?: (response: any) => any): void {
    const args = arguments.length;

    ports.forEach(port => {

        it("asserting port " + port, () => {
            if (args === 4) {
                return chakram[method](`http://127.0.0.1:${port}/${route}`).then(dataOrCallback as Function);
            } else if (args === 5) {
                return chakram[method](`http://127.0.0.1:${port}/${route}`, dataOrCallback as any).then(dataOrRequestOptionsOrCallback as Function);
            } else if (args === 6) {
                return chakram[method](`http://127.0.0.1:${port}/${route}`, dataOrCallback as any, dataOrRequestOptionsOrCallback as any).then(maybeCallback);
            }
            
            throw new Error("No assertion has been performed");
        });
        
    });
    
}