var execSync = require('child_process').execSync;

var info = execSync('heroku apps:info').toString();
var appName = info.substring(4, info.indexOf('\n'));

var commands = [
  'heroku config:set REBUILD_ALL=true',
  'heroku plugins:install https://github.com/heroku/heroku-repo.git',
  'heroku repo:purge_cache -a ' + appName,
  'git push heroku master',
  'heroku config:unset REBUILD_ALL',
  'heroku plugins:uninstall heroku-repo'
];

commands.forEach(function(command) {
  console.log(command);
  console.log(execSync(command).toString());
});
