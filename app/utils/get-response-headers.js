export default function getResponseHeaders(jqXHR) {
  let headers = jqXHR.getAllResponseHeaders().trim().split('\n');
  headers = headers.reduce((previousValue, currentValue) => {
    let split = currentValue.split(': ');
    previousValue[split[0]] = split[1];
    return previousValue;
  }, {});
  return headers;
}
