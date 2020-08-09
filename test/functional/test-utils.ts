const chakram = require('chakram');

export function assertRequest(ports: number[], method: string, route: string, callback: (response: any) => any): void;
export function assertRequest(
  ports: number[],
  method: string,
  route: string,
  dataOrOptions: any,
  callback: (response: any) => any
): void;
export function assertRequest(
  ports: number[],
  method: string,
  route: string,
  data: any,
  requestOptions: any,
  callback: (response: any) => any
): void;
export function assertRequest(
  ports: number[],
  method: string,
  route: string,
  dataOrCallback: any | ((response: any) => any),
  dataOrRequestOptionsOrCallback?: any | ((response: any) => any),
  maybeCallback?: (response: any) => any
): void {
  const args = arguments.length;

  ports.forEach(port => {
    it('asserting port ' + port, async () => {
      let unhandledRejection: Error = undefined;
      const captureRejection = (e: Error) => {
        unhandledRejection = e;
      };
      process.on('unhandledRejection', captureRejection);

      try {
        let r;
        if (args === 4) {
          r = await chakram[method](`http://127.0.0.1:${port}/${route}`).then(dataOrCallback as Function);
        } else if (args === 5) {
          r = await chakram[method](`http://127.0.0.1:${port}/${route}`, dataOrCallback as any).then(
            dataOrRequestOptionsOrCallback as Function
          );
        } else if (args === 6) {
          r = await chakram[method](
            `http://127.0.0.1:${port}/${route}`,
            dataOrCallback as any,
            dataOrRequestOptionsOrCallback as any
          ).then(maybeCallback);
        } else {
          throw new Error('No assertion has been performed');
        }

        if (unhandledRejection) {
          const e = new Error('There was an unhandled rejection while processing the request');
          e.stack += '\nCaused by: ' + unhandledRejection.stack;
          throw e;
        }

        return r;
      } finally {
        process.removeListener('unhandledRejection', captureRejection);
      }
    });
  });
}
