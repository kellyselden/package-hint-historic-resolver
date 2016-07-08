export default function parseResponseHeaders(responseHeaders) {
  let headers = responseHeaders.trim().split('\n').filter(s => s);
  headers = headers.reduce((previousValue, currentValue) => {
    let split = currentValue.split(': ');
    previousValue[split[0]] = split[1];
    return previousValue;
  }, {});
  return headers;
}
