import * as rp from 'request-promise-native';

export function assertRequest(
  ports: Array<number>,
  {body, formData, headers, jar, uri, method = 'GET', json = true}: rp.OptionsWithUri,
  callback: (response: any) => any,
): void {
  ports.forEach(port => {
    it(`asserting port ${port}`, () => {
      return rp({
        method,
        uri: `http://127.0.0.1:${port}/${uri}`,
        body,
        headers,
        formData,
        jar,
        resolveWithFullResponse: true,
        simple: false,
        json,
      }).then(callback);
    });
  });
}
