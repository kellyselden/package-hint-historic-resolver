export default function getRepo(url) {
  if (!url) {
    return;
  }

  if (url.indexOf('/', url.length - 1) !== -1) {
    url = url.substr(0, url.length - 1);
  }
  let fragments = url.split('/');
  if (fragments.length < 2) {
    return;
  }

  let [repo, user] = fragments.reverse();
  return `${user}/${repo}`;
}
