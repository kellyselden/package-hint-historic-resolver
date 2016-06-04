import Ember from 'ember';
import { task } from 'ember-concurrency';
import moment from 'moment';

const {
  Service,
  inject: { service },
  get
} = Ember;

export default Service.extend({
  requestCache: service(),

  getCommit: task(function * (repo, date) {
    if (repo === 'lydell/line-numbers') {
      let [latestCommit] = yield Ember.RSVP.resolve([
        {
          "sha": "2938da4a39ba5274063d4ee6acbb869f5b58dd85",
          "commit": {
            "author": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2016-03-23T18:41:40Z"
            },
            "committer": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2016-03-23T18:41:40Z"
            },
            "message": "line-numbers v0.2.2",
            "tree": {
              "sha": "ff4492aad3aa2f6892f621b6e637ee2ae4d80a82",
              "url": "https://api.github.com/repos/lydell/line-numbers/git/trees/ff4492aad3aa2f6892f621b6e637ee2ae4d80a82"
            },
            "url": "https://api.github.com/repos/lydell/line-numbers/git/commits/2938da4a39ba5274063d4ee6acbb869f5b58dd85",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/lydell/line-numbers/commits/2938da4a39ba5274063d4ee6acbb869f5b58dd85",
          "html_url": "https://github.com/lydell/line-numbers/commit/2938da4a39ba5274063d4ee6acbb869f5b58dd85",
          "comments_url": "https://api.github.com/repos/lydell/line-numbers/commits/2938da4a39ba5274063d4ee6acbb869f5b58dd85/comments",
          "author": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "711f6ad0eb1771341aecb59d83f139a24d862dba",
              "url": "https://api.github.com/repos/lydell/line-numbers/commits/711f6ad0eb1771341aecb59d83f139a24d862dba",
              "html_url": "https://github.com/lydell/line-numbers/commit/711f6ad0eb1771341aecb59d83f139a24d862dba"
            }
          ]
        },
        {
          "sha": "711f6ad0eb1771341aecb59d83f139a24d862dba",
          "commit": {
            "author": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2016-03-23T18:39:28Z"
            },
            "committer": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2016-03-23T18:39:28Z"
            },
            "message": "Add deprecation notice",
            "tree": {
              "sha": "9e3df39ec8244a779d1b13208df372bc3073a6a4",
              "url": "https://api.github.com/repos/lydell/line-numbers/git/trees/9e3df39ec8244a779d1b13208df372bc3073a6a4"
            },
            "url": "https://api.github.com/repos/lydell/line-numbers/git/commits/711f6ad0eb1771341aecb59d83f139a24d862dba",
            "comment_count": 3
          },
          "url": "https://api.github.com/repos/lydell/line-numbers/commits/711f6ad0eb1771341aecb59d83f139a24d862dba",
          "html_url": "https://github.com/lydell/line-numbers/commit/711f6ad0eb1771341aecb59d83f139a24d862dba",
          "comments_url": "https://api.github.com/repos/lydell/line-numbers/commits/711f6ad0eb1771341aecb59d83f139a24d862dba/comments",
          "author": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "b3205b3d0f3abc51db83e9f4cbd1111de4c4a3e2",
              "url": "https://api.github.com/repos/lydell/line-numbers/commits/b3205b3d0f3abc51db83e9f4cbd1111de4c4a3e2",
              "html_url": "https://github.com/lydell/line-numbers/commit/b3205b3d0f3abc51db83e9f4cbd1111de4c4a3e2"
            }
          ]
        },
        {
          "sha": "b3205b3d0f3abc51db83e9f4cbd1111de4c4a3e2",
          "commit": {
            "author": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2016-03-23T18:26:27Z"
            },
            "committer": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2016-03-23T18:26:27Z"
            },
            "message": "line-numbers v0.2.1",
            "tree": {
              "sha": "0cf3ef97cefff0a91c3997c0297133b57fb6ddab",
              "url": "https://api.github.com/repos/lydell/line-numbers/git/trees/0cf3ef97cefff0a91c3997c0297133b57fb6ddab"
            },
            "url": "https://api.github.com/repos/lydell/line-numbers/git/commits/b3205b3d0f3abc51db83e9f4cbd1111de4c4a3e2",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/lydell/line-numbers/commits/b3205b3d0f3abc51db83e9f4cbd1111de4c4a3e2",
          "html_url": "https://github.com/lydell/line-numbers/commit/b3205b3d0f3abc51db83e9f4cbd1111de4c4a3e2",
          "comments_url": "https://api.github.com/repos/lydell/line-numbers/commits/b3205b3d0f3abc51db83e9f4cbd1111de4c4a3e2/comments",
          "author": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "495bb686a41dc8a73a39feb414adf7770b794e0e",
              "url": "https://api.github.com/repos/lydell/line-numbers/commits/495bb686a41dc8a73a39feb414adf7770b794e0e",
              "html_url": "https://github.com/lydell/line-numbers/commit/495bb686a41dc8a73a39feb414adf7770b794e0e"
            }
          ]
        },
        {
          "sha": "495bb686a41dc8a73a39feb414adf7770b794e0e",
          "commit": {
            "author": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2016-03-23T18:22:59Z"
            },
            "committer": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2016-03-23T18:22:59Z"
            },
            "message": "Update the left-pad dependecy to ^1.0.1\n\nCloses #1. Closes #2. Closes #4.",
            "tree": {
              "sha": "29f3197f1020a08ddbf7f52f1df8759b3ab0a0b5",
              "url": "https://api.github.com/repos/lydell/line-numbers/git/trees/29f3197f1020a08ddbf7f52f1df8759b3ab0a0b5"
            },
            "url": "https://api.github.com/repos/lydell/line-numbers/git/commits/495bb686a41dc8a73a39feb414adf7770b794e0e",
            "comment_count": 3
          },
          "url": "https://api.github.com/repos/lydell/line-numbers/commits/495bb686a41dc8a73a39feb414adf7770b794e0e",
          "html_url": "https://github.com/lydell/line-numbers/commit/495bb686a41dc8a73a39feb414adf7770b794e0e",
          "comments_url": "https://api.github.com/repos/lydell/line-numbers/commits/495bb686a41dc8a73a39feb414adf7770b794e0e/comments",
          "author": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "2904d5ffabea94de334b5133d1971dc4b47bcb2d",
              "url": "https://api.github.com/repos/lydell/line-numbers/commits/2904d5ffabea94de334b5133d1971dc4b47bcb2d",
              "html_url": "https://github.com/lydell/line-numbers/commit/2904d5ffabea94de334b5133d1971dc4b47bcb2d"
            }
          ]
        },
        {
          "sha": "2904d5ffabea94de334b5133d1971dc4b47bcb2d",
          "commit": {
            "author": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2016-03-23T18:21:40Z"
            },
            "committer": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2016-03-23T18:21:40Z"
            },
            "message": "Update .travis.yml",
            "tree": {
              "sha": "77f46ed949d8ace63fd30e366a9824134059c12d",
              "url": "https://api.github.com/repos/lydell/line-numbers/git/trees/77f46ed949d8ace63fd30e366a9824134059c12d"
            },
            "url": "https://api.github.com/repos/lydell/line-numbers/git/commits/2904d5ffabea94de334b5133d1971dc4b47bcb2d",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/lydell/line-numbers/commits/2904d5ffabea94de334b5133d1971dc4b47bcb2d",
          "html_url": "https://github.com/lydell/line-numbers/commit/2904d5ffabea94de334b5133d1971dc4b47bcb2d",
          "comments_url": "https://api.github.com/repos/lydell/line-numbers/commits/2904d5ffabea94de334b5133d1971dc4b47bcb2d/comments",
          "author": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "eb82c0c3da335fbd80111b771a6a3e38d7f63900",
              "url": "https://api.github.com/repos/lydell/line-numbers/commits/eb82c0c3da335fbd80111b771a6a3e38d7f63900",
              "html_url": "https://github.com/lydell/line-numbers/commit/eb82c0c3da335fbd80111b771a6a3e38d7f63900"
            }
          ]
        },
        {
          "sha": "eb82c0c3da335fbd80111b771a6a3e38d7f63900",
          "commit": {
            "author": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2015-02-21T17:50:30Z"
            },
            "committer": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2015-02-21T17:50:30Z"
            },
            "message": "line-numbers v0.2.0",
            "tree": {
              "sha": "39cd033b26727a574e93cee55f96aaa408710d95",
              "url": "https://api.github.com/repos/lydell/line-numbers/git/trees/39cd033b26727a574e93cee55f96aaa408710d95"
            },
            "url": "https://api.github.com/repos/lydell/line-numbers/git/commits/eb82c0c3da335fbd80111b771a6a3e38d7f63900",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/lydell/line-numbers/commits/eb82c0c3da335fbd80111b771a6a3e38d7f63900",
          "html_url": "https://github.com/lydell/line-numbers/commit/eb82c0c3da335fbd80111b771a6a3e38d7f63900",
          "comments_url": "https://api.github.com/repos/lydell/line-numbers/commits/eb82c0c3da335fbd80111b771a6a3e38d7f63900/comments",
          "author": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "5aa038589d0926be89a277149285da9df763a85c",
              "url": "https://api.github.com/repos/lydell/line-numbers/commits/5aa038589d0926be89a277149285da9df763a85c",
              "html_url": "https://github.com/lydell/line-numbers/commit/5aa038589d0926be89a277149285da9df763a85c"
            }
          ]
        },
        {
          "sha": "5aa038589d0926be89a277149285da9df763a85c",
          "commit": {
            "author": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2015-02-21T17:07:19Z"
            },
            "committer": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2015-02-21T17:07:19Z"
            },
            "message": "Make `options.transform` more flexible\n\nIt is now passed an object with all the elements of the current line, allowing\nyou to modifiy it.",
            "tree": {
              "sha": "e78643e9caa3cb165b6c4b670ec86f31a25cd781",
              "url": "https://api.github.com/repos/lydell/line-numbers/git/trees/e78643e9caa3cb165b6c4b670ec86f31a25cd781"
            },
            "url": "https://api.github.com/repos/lydell/line-numbers/git/commits/5aa038589d0926be89a277149285da9df763a85c",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/lydell/line-numbers/commits/5aa038589d0926be89a277149285da9df763a85c",
          "html_url": "https://github.com/lydell/line-numbers/commit/5aa038589d0926be89a277149285da9df763a85c",
          "comments_url": "https://api.github.com/repos/lydell/line-numbers/commits/5aa038589d0926be89a277149285da9df763a85c/comments",
          "author": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "0c6745040115096e5b12898cb4957b636773be85",
              "url": "https://api.github.com/repos/lydell/line-numbers/commits/0c6745040115096e5b12898cb4957b636773be85",
              "html_url": "https://github.com/lydell/line-numbers/commit/0c6745040115096e5b12898cb4957b636773be85"
            }
          ]
        },
        {
          "sha": "0c6745040115096e5b12898cb4957b636773be85",
          "commit": {
            "author": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2015-02-21T16:21:45Z"
            },
            "committer": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2015-02-21T16:22:38Z"
            },
            "message": "Allow to pass an array of customly split lines",
            "tree": {
              "sha": "bc15f1f84e559c70bc6cb7d3f59f315f217b96c4",
              "url": "https://api.github.com/repos/lydell/line-numbers/git/trees/bc15f1f84e559c70bc6cb7d3f59f315f217b96c4"
            },
            "url": "https://api.github.com/repos/lydell/line-numbers/git/commits/0c6745040115096e5b12898cb4957b636773be85",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/lydell/line-numbers/commits/0c6745040115096e5b12898cb4957b636773be85",
          "html_url": "https://github.com/lydell/line-numbers/commit/0c6745040115096e5b12898cb4957b636773be85",
          "comments_url": "https://api.github.com/repos/lydell/line-numbers/commits/0c6745040115096e5b12898cb4957b636773be85/comments",
          "author": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "bb120569e8e5b25f115f8d94817dc9e3576ee73c",
              "url": "https://api.github.com/repos/lydell/line-numbers/commits/bb120569e8e5b25f115f8d94817dc9e3576ee73c",
              "html_url": "https://github.com/lydell/line-numbers/commit/bb120569e8e5b25f115f8d94817dc9e3576ee73c"
            }
          ]
        },
        {
          "sha": "bb120569e8e5b25f115f8d94817dc9e3576ee73c",
          "commit": {
            "author": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2014-12-20T22:25:43Z"
            },
            "committer": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2014-12-20T22:25:43Z"
            },
            "message": "line-numbers v0.1.0",
            "tree": {
              "sha": "02e59e76e070ae13f77caf056b9389fa2d084d48",
              "url": "https://api.github.com/repos/lydell/line-numbers/git/trees/02e59e76e070ae13f77caf056b9389fa2d084d48"
            },
            "url": "https://api.github.com/repos/lydell/line-numbers/git/commits/bb120569e8e5b25f115f8d94817dc9e3576ee73c",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/lydell/line-numbers/commits/bb120569e8e5b25f115f8d94817dc9e3576ee73c",
          "html_url": "https://github.com/lydell/line-numbers/commit/bb120569e8e5b25f115f8d94817dc9e3576ee73c",
          "comments_url": "https://api.github.com/repos/lydell/line-numbers/commits/bb120569e8e5b25f115f8d94817dc9e3576ee73c/comments",
          "author": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "7c9c1484867fa2c8e8874bff98f62576464aa9a2",
              "url": "https://api.github.com/repos/lydell/line-numbers/commits/7c9c1484867fa2c8e8874bff98f62576464aa9a2",
              "html_url": "https://github.com/lydell/line-numbers/commit/7c9c1484867fa2c8e8874bff98f62576464aa9a2"
            }
          ]
        },
        {
          "sha": "7c9c1484867fa2c8e8874bff98f62576464aa9a2",
          "commit": {
            "author": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2014-12-20T22:24:18Z"
            },
            "committer": {
              "name": "Simon Lydell",
              "email": "simon.lydell@gmail.com",
              "date": "2014-12-20T22:24:18Z"
            },
            "message": "Initial commit",
            "tree": {
              "sha": "5c3d81b314922308743808ce083020165409bea5",
              "url": "https://api.github.com/repos/lydell/line-numbers/git/trees/5c3d81b314922308743808ce083020165409bea5"
            },
            "url": "https://api.github.com/repos/lydell/line-numbers/git/commits/7c9c1484867fa2c8e8874bff98f62576464aa9a2",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/lydell/line-numbers/commits/7c9c1484867fa2c8e8874bff98f62576464aa9a2",
          "html_url": "https://github.com/lydell/line-numbers/commit/7c9c1484867fa2c8e8874bff98f62576464aa9a2",
          "comments_url": "https://api.github.com/repos/lydell/line-numbers/commits/7c9c1484867fa2c8e8874bff98f62576464aa9a2/comments",
          "author": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "lydell",
            "id": 2142817,
            "avatar_url": "https://avatars.githubusercontent.com/u/2142817?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/lydell",
            "html_url": "https://github.com/lydell",
            "followers_url": "https://api.github.com/users/lydell/followers",
            "following_url": "https://api.github.com/users/lydell/following{/other_user}",
            "gists_url": "https://api.github.com/users/lydell/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/lydell/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/lydell/subscriptions",
            "organizations_url": "https://api.github.com/users/lydell/orgs",
            "repos_url": "https://api.github.com/users/lydell/repos",
            "events_url": "https://api.github.com/users/lydell/events{/privacy}",
            "received_events_url": "https://api.github.com/users/lydell/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [

          ]
        }
      ]);
      return latestCommit;
    } else if (repo === 'ember-cli/ember-cli') {
      let [latestCommit] = yield Ember.RSVP.resolve([
        {
          "sha": "a72decc70e5cd237e8bf434f6b6771224210520b",
          "commit": {
            "author": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-11T02:39:09Z"
            },
            "committer": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-11T02:39:09Z"
            },
            "message": "Auto merge of #5972 - ember-cli:ease-core-object-upgrade, r=nathanhammond\n\n[BUGFIX release] ease core-object upgrade for addons which lack .project",
            "tree": {
              "sha": "4c8753e446e81862712f239a62c20858bdf1edfe",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/4c8753e446e81862712f239a62c20858bdf1edfe"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/a72decc70e5cd237e8bf434f6b6771224210520b",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/a72decc70e5cd237e8bf434f6b6771224210520b",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/a72decc70e5cd237e8bf434f6b6771224210520b",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/a72decc70e5cd237e8bf434f6b6771224210520b/comments",
          "author": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "d86501b1acf2ccc2e2aa04cb8b66c21392dca396",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/d86501b1acf2ccc2e2aa04cb8b66c21392dca396",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/d86501b1acf2ccc2e2aa04cb8b66c21392dca396"
            },
            {
              "sha": "6cb0713132dc9a2d911adc5e91f86dcd41fb2f74",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/6cb0713132dc9a2d911adc5e91f86dcd41fb2f74",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/6cb0713132dc9a2d911adc5e91f86dcd41fb2f74"
            }
          ]
        },
        {
          "sha": "d86501b1acf2ccc2e2aa04cb8b66c21392dca396",
          "commit": {
            "author": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-11T01:55:31Z"
            },
            "committer": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-11T01:55:31Z"
            },
            "message": "Auto merge of #5970 - nathanhammond:release-branching, r=nathanhammond\n\nAdd release documentation about branching strategy.\n\nThis is the process I went through for this release. It's accurate to real life, but doesn't provide all details. Capturing it anyway.",
            "tree": {
              "sha": "86073fb6aa7a2fb6ace745bc54ad94850768a92e",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/86073fb6aa7a2fb6ace745bc54ad94850768a92e"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/d86501b1acf2ccc2e2aa04cb8b66c21392dca396",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/d86501b1acf2ccc2e2aa04cb8b66c21392dca396",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/d86501b1acf2ccc2e2aa04cb8b66c21392dca396",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/d86501b1acf2ccc2e2aa04cb8b66c21392dca396/comments",
          "author": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "8a738a4387087fffbf3233a98857b9f648963722",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8a738a4387087fffbf3233a98857b9f648963722",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/8a738a4387087fffbf3233a98857b9f648963722"
            },
            {
              "sha": "4762ed14e28e32cea62452c4296c83d9d4e17a98",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/4762ed14e28e32cea62452c4296c83d9d4e17a98",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/4762ed14e28e32cea62452c4296c83d9d4e17a98"
            }
          ]
        },
        {
          "sha": "4762ed14e28e32cea62452c4296c83d9d4e17a98",
          "commit": {
            "author": {
              "name": "Nathan Hammond",
              "email": "github.com@nathanhammond.com",
              "date": "2016-06-10T09:24:56Z"
            },
            "committer": {
              "name": "Nathan Hammond",
              "email": "github.com@nathanhammond.com",
              "date": "2016-06-11T01:54:51Z"
            },
            "message": "Add release documentation about branching strategy.",
            "tree": {
              "sha": "e4feca212d96b8a12c12008ece24d887be08dc25",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/e4feca212d96b8a12c12008ece24d887be08dc25"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/4762ed14e28e32cea62452c4296c83d9d4e17a98",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/4762ed14e28e32cea62452c4296c83d9d4e17a98",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/4762ed14e28e32cea62452c4296c83d9d4e17a98",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/4762ed14e28e32cea62452c4296c83d9d4e17a98/comments",
          "author": {
            "login": "nathanhammond",
            "id": 20542,
            "avatar_url": "https://avatars.githubusercontent.com/u/20542?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/nathanhammond",
            "html_url": "https://github.com/nathanhammond",
            "followers_url": "https://api.github.com/users/nathanhammond/followers",
            "following_url": "https://api.github.com/users/nathanhammond/following{/other_user}",
            "gists_url": "https://api.github.com/users/nathanhammond/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/nathanhammond/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/nathanhammond/subscriptions",
            "organizations_url": "https://api.github.com/users/nathanhammond/orgs",
            "repos_url": "https://api.github.com/users/nathanhammond/repos",
            "events_url": "https://api.github.com/users/nathanhammond/events{/privacy}",
            "received_events_url": "https://api.github.com/users/nathanhammond/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "nathanhammond",
            "id": 20542,
            "avatar_url": "https://avatars.githubusercontent.com/u/20542?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/nathanhammond",
            "html_url": "https://github.com/nathanhammond",
            "followers_url": "https://api.github.com/users/nathanhammond/followers",
            "following_url": "https://api.github.com/users/nathanhammond/following{/other_user}",
            "gists_url": "https://api.github.com/users/nathanhammond/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/nathanhammond/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/nathanhammond/subscriptions",
            "organizations_url": "https://api.github.com/users/nathanhammond/orgs",
            "repos_url": "https://api.github.com/users/nathanhammond/repos",
            "events_url": "https://api.github.com/users/nathanhammond/events{/privacy}",
            "received_events_url": "https://api.github.com/users/nathanhammond/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "084e9ea1db867c7a120d54cf9ebbe06989934b0f",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/084e9ea1db867c7a120d54cf9ebbe06989934b0f",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/084e9ea1db867c7a120d54cf9ebbe06989934b0f"
            }
          ]
        },
        {
          "sha": "6cb0713132dc9a2d911adc5e91f86dcd41fb2f74",
          "commit": {
            "author": {
              "name": "Stefan Penner",
              "email": "stefan.penner@gmail.com",
              "date": "2016-06-10T18:40:12Z"
            },
            "committer": {
              "name": "Stefan Penner",
              "email": "stefan.penner@gmail.com",
              "date": "2016-06-10T20:18:55Z"
            },
            "message": "[BUGFIX Release] Add warning for addons missing project\n\nSome addons may not have been instantiated correctly (for latest CoreObject)\nThis detects a common failure mode. Hopefully this helps us catch and\nupgrade these addons quickly.",
            "tree": {
              "sha": "976591697993dab759321c54b33ab3e39426ce8d",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/976591697993dab759321c54b33ab3e39426ce8d"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/6cb0713132dc9a2d911adc5e91f86dcd41fb2f74",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/6cb0713132dc9a2d911adc5e91f86dcd41fb2f74",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/6cb0713132dc9a2d911adc5e91f86dcd41fb2f74",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/6cb0713132dc9a2d911adc5e91f86dcd41fb2f74/comments",
          "author": {
            "login": "stefanpenner",
            "id": 1377,
            "avatar_url": "https://avatars.githubusercontent.com/u/1377?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/stefanpenner",
            "html_url": "https://github.com/stefanpenner",
            "followers_url": "https://api.github.com/users/stefanpenner/followers",
            "following_url": "https://api.github.com/users/stefanpenner/following{/other_user}",
            "gists_url": "https://api.github.com/users/stefanpenner/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/stefanpenner/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/stefanpenner/subscriptions",
            "organizations_url": "https://api.github.com/users/stefanpenner/orgs",
            "repos_url": "https://api.github.com/users/stefanpenner/repos",
            "events_url": "https://api.github.com/users/stefanpenner/events{/privacy}",
            "received_events_url": "https://api.github.com/users/stefanpenner/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "stefanpenner",
            "id": 1377,
            "avatar_url": "https://avatars.githubusercontent.com/u/1377?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/stefanpenner",
            "html_url": "https://github.com/stefanpenner",
            "followers_url": "https://api.github.com/users/stefanpenner/followers",
            "following_url": "https://api.github.com/users/stefanpenner/following{/other_user}",
            "gists_url": "https://api.github.com/users/stefanpenner/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/stefanpenner/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/stefanpenner/subscriptions",
            "organizations_url": "https://api.github.com/users/stefanpenner/orgs",
            "repos_url": "https://api.github.com/users/stefanpenner/repos",
            "events_url": "https://api.github.com/users/stefanpenner/events{/privacy}",
            "received_events_url": "https://api.github.com/users/stefanpenner/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "5be984271914e9c23b7c5b4683c833526e17dc99",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/5be984271914e9c23b7c5b4683c833526e17dc99",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/5be984271914e9c23b7c5b4683c833526e17dc99"
            }
          ]
        },
        {
          "sha": "5be984271914e9c23b7c5b4683c833526e17dc99",
          "commit": {
            "author": {
              "name": "Stefan Penner",
              "email": "stefan.penner@gmail.com",
              "date": "2016-06-10T16:13:54Z"
            },
            "committer": {
              "name": "Stefan Penner",
              "email": "stefan.penner@gmail.com",
              "date": "2016-06-10T16:17:39Z"
            },
            "message": "[BUGFIX release] ease core-object upgrade for addons which lack .project\n[Fixes #5945]",
            "tree": {
              "sha": "f817410f99321a35c219c684c545363cf3bfa01c",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/f817410f99321a35c219c684c545363cf3bfa01c"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/5be984271914e9c23b7c5b4683c833526e17dc99",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/5be984271914e9c23b7c5b4683c833526e17dc99",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/5be984271914e9c23b7c5b4683c833526e17dc99",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/5be984271914e9c23b7c5b4683c833526e17dc99/comments",
          "author": {
            "login": "stefanpenner",
            "id": 1377,
            "avatar_url": "https://avatars.githubusercontent.com/u/1377?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/stefanpenner",
            "html_url": "https://github.com/stefanpenner",
            "followers_url": "https://api.github.com/users/stefanpenner/followers",
            "following_url": "https://api.github.com/users/stefanpenner/following{/other_user}",
            "gists_url": "https://api.github.com/users/stefanpenner/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/stefanpenner/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/stefanpenner/subscriptions",
            "organizations_url": "https://api.github.com/users/stefanpenner/orgs",
            "repos_url": "https://api.github.com/users/stefanpenner/repos",
            "events_url": "https://api.github.com/users/stefanpenner/events{/privacy}",
            "received_events_url": "https://api.github.com/users/stefanpenner/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "stefanpenner",
            "id": 1377,
            "avatar_url": "https://avatars.githubusercontent.com/u/1377?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/stefanpenner",
            "html_url": "https://github.com/stefanpenner",
            "followers_url": "https://api.github.com/users/stefanpenner/followers",
            "following_url": "https://api.github.com/users/stefanpenner/following{/other_user}",
            "gists_url": "https://api.github.com/users/stefanpenner/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/stefanpenner/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/stefanpenner/subscriptions",
            "organizations_url": "https://api.github.com/users/stefanpenner/orgs",
            "repos_url": "https://api.github.com/users/stefanpenner/repos",
            "events_url": "https://api.github.com/users/stefanpenner/events{/privacy}",
            "received_events_url": "https://api.github.com/users/stefanpenner/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "8a738a4387087fffbf3233a98857b9f648963722",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8a738a4387087fffbf3233a98857b9f648963722",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/8a738a4387087fffbf3233a98857b9f648963722"
            }
          ]
        },
        {
          "sha": "8a738a4387087fffbf3233a98857b9f648963722",
          "commit": {
            "author": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-10T12:37:25Z"
            },
            "committer": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-10T12:37:25Z"
            },
            "message": "Auto merge of #5962 - josemarluedke:fix-test-index, r=Turbo87\n\n[BUGFIX canary] Remove test-loader from tests/index blueprint\n\nSince the test-loader was moved to NPM (#5885), calling test-loader.js from index is not necessary anymore.",
            "tree": {
              "sha": "70f59bb4f71bedeb6beb6f3b8c4eb643bc085d3a",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/70f59bb4f71bedeb6beb6f3b8c4eb643bc085d3a"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/8a738a4387087fffbf3233a98857b9f648963722",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8a738a4387087fffbf3233a98857b9f648963722",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/8a738a4387087fffbf3233a98857b9f648963722",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8a738a4387087fffbf3233a98857b9f648963722/comments",
          "author": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "084e9ea1db867c7a120d54cf9ebbe06989934b0f",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/084e9ea1db867c7a120d54cf9ebbe06989934b0f",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/084e9ea1db867c7a120d54cf9ebbe06989934b0f"
            },
            {
              "sha": "4687fe353ad12cf9ed2ccd224d74f88c3532ff6f",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/4687fe353ad12cf9ed2ccd224d74f88c3532ff6f",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/4687fe353ad12cf9ed2ccd224d74f88c3532ff6f"
            }
          ]
        },
        {
          "sha": "084e9ea1db867c7a120d54cf9ebbe06989934b0f",
          "commit": {
            "author": {
              "name": "Nathan Hammond",
              "email": "github.com@nathanhammond.com",
              "date": "2016-06-10T08:56:23Z"
            },
            "committer": {
              "name": "Nathan Hammond",
              "email": "github.com@nathanhammond.com",
              "date": "2016-06-10T08:56:23Z"
            },
            "message": "Release v2.7.0-beta.1",
            "tree": {
              "sha": "8b9759d309410fd28411e9ccbb68d35e8b4931ae",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/8b9759d309410fd28411e9ccbb68d35e8b4931ae"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/084e9ea1db867c7a120d54cf9ebbe06989934b0f",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/084e9ea1db867c7a120d54cf9ebbe06989934b0f",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/084e9ea1db867c7a120d54cf9ebbe06989934b0f",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/084e9ea1db867c7a120d54cf9ebbe06989934b0f/comments",
          "author": {
            "login": "nathanhammond",
            "id": 20542,
            "avatar_url": "https://avatars.githubusercontent.com/u/20542?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/nathanhammond",
            "html_url": "https://github.com/nathanhammond",
            "followers_url": "https://api.github.com/users/nathanhammond/followers",
            "following_url": "https://api.github.com/users/nathanhammond/following{/other_user}",
            "gists_url": "https://api.github.com/users/nathanhammond/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/nathanhammond/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/nathanhammond/subscriptions",
            "organizations_url": "https://api.github.com/users/nathanhammond/orgs",
            "repos_url": "https://api.github.com/users/nathanhammond/repos",
            "events_url": "https://api.github.com/users/nathanhammond/events{/privacy}",
            "received_events_url": "https://api.github.com/users/nathanhammond/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "nathanhammond",
            "id": 20542,
            "avatar_url": "https://avatars.githubusercontent.com/u/20542?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/nathanhammond",
            "html_url": "https://github.com/nathanhammond",
            "followers_url": "https://api.github.com/users/nathanhammond/followers",
            "following_url": "https://api.github.com/users/nathanhammond/following{/other_user}",
            "gists_url": "https://api.github.com/users/nathanhammond/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/nathanhammond/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/nathanhammond/subscriptions",
            "organizations_url": "https://api.github.com/users/nathanhammond/orgs",
            "repos_url": "https://api.github.com/users/nathanhammond/repos",
            "events_url": "https://api.github.com/users/nathanhammond/events{/privacy}",
            "received_events_url": "https://api.github.com/users/nathanhammond/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "d076a3cea4112dff76a21c4400e8f929aa527149",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/d076a3cea4112dff76a21c4400e8f929aa527149",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/d076a3cea4112dff76a21c4400e8f929aa527149"
            }
          ]
        },
        {
          "sha": "d076a3cea4112dff76a21c4400e8f929aa527149",
          "commit": {
            "author": {
              "name": "Nathan Hammond",
              "email": "github.com@nathanhammond.com",
              "date": "2016-06-10T08:19:30Z"
            },
            "committer": {
              "name": "Nathan Hammond",
              "email": "github.com@nathanhammond.com",
              "date": "2016-06-10T08:19:30Z"
            },
            "message": "Merge tag 'v2.6.0' into beta",
            "tree": {
              "sha": "025bb4c67b8cfe5a83c30b7bd074b5bd7f67c0a3",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/025bb4c67b8cfe5a83c30b7bd074b5bd7f67c0a3"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/d076a3cea4112dff76a21c4400e8f929aa527149",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/d076a3cea4112dff76a21c4400e8f929aa527149",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/d076a3cea4112dff76a21c4400e8f929aa527149",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/d076a3cea4112dff76a21c4400e8f929aa527149/comments",
          "author": {
            "login": "nathanhammond",
            "id": 20542,
            "avatar_url": "https://avatars.githubusercontent.com/u/20542?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/nathanhammond",
            "html_url": "https://github.com/nathanhammond",
            "followers_url": "https://api.github.com/users/nathanhammond/followers",
            "following_url": "https://api.github.com/users/nathanhammond/following{/other_user}",
            "gists_url": "https://api.github.com/users/nathanhammond/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/nathanhammond/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/nathanhammond/subscriptions",
            "organizations_url": "https://api.github.com/users/nathanhammond/orgs",
            "repos_url": "https://api.github.com/users/nathanhammond/repos",
            "events_url": "https://api.github.com/users/nathanhammond/events{/privacy}",
            "received_events_url": "https://api.github.com/users/nathanhammond/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "nathanhammond",
            "id": 20542,
            "avatar_url": "https://avatars.githubusercontent.com/u/20542?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/nathanhammond",
            "html_url": "https://github.com/nathanhammond",
            "followers_url": "https://api.github.com/users/nathanhammond/followers",
            "following_url": "https://api.github.com/users/nathanhammond/following{/other_user}",
            "gists_url": "https://api.github.com/users/nathanhammond/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/nathanhammond/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/nathanhammond/subscriptions",
            "organizations_url": "https://api.github.com/users/nathanhammond/orgs",
            "repos_url": "https://api.github.com/users/nathanhammond/repos",
            "events_url": "https://api.github.com/users/nathanhammond/events{/privacy}",
            "received_events_url": "https://api.github.com/users/nathanhammond/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "341519d91d61dfcb3d829a33b1878513c4fe2c36",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/341519d91d61dfcb3d829a33b1878513c4fe2c36",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/341519d91d61dfcb3d829a33b1878513c4fe2c36"
            },
            {
              "sha": "0d635e9f811d5ad61493681421fb26480b7827f2",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/0d635e9f811d5ad61493681421fb26480b7827f2",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/0d635e9f811d5ad61493681421fb26480b7827f2"
            }
          ]
        },
        {
          "sha": "341519d91d61dfcb3d829a33b1878513c4fe2c36",
          "commit": {
            "author": {
              "name": "Nathan Hammond",
              "email": "github.com@nathanhammond.com",
              "date": "2016-06-10T08:17:21Z"
            },
            "committer": {
              "name": "Nathan Hammond",
              "email": "github.com@nathanhammond.com",
              "date": "2016-06-10T08:17:21Z"
            },
            "message": "Merge branch 'master' into beta",
            "tree": {
              "sha": "7d6db34210c909627670a8ba40b2543f53063ff5",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/7d6db34210c909627670a8ba40b2543f53063ff5"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/341519d91d61dfcb3d829a33b1878513c4fe2c36",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/341519d91d61dfcb3d829a33b1878513c4fe2c36",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/341519d91d61dfcb3d829a33b1878513c4fe2c36",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/341519d91d61dfcb3d829a33b1878513c4fe2c36/comments",
          "author": {
            "login": "nathanhammond",
            "id": 20542,
            "avatar_url": "https://avatars.githubusercontent.com/u/20542?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/nathanhammond",
            "html_url": "https://github.com/nathanhammond",
            "followers_url": "https://api.github.com/users/nathanhammond/followers",
            "following_url": "https://api.github.com/users/nathanhammond/following{/other_user}",
            "gists_url": "https://api.github.com/users/nathanhammond/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/nathanhammond/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/nathanhammond/subscriptions",
            "organizations_url": "https://api.github.com/users/nathanhammond/orgs",
            "repos_url": "https://api.github.com/users/nathanhammond/repos",
            "events_url": "https://api.github.com/users/nathanhammond/events{/privacy}",
            "received_events_url": "https://api.github.com/users/nathanhammond/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "nathanhammond",
            "id": 20542,
            "avatar_url": "https://avatars.githubusercontent.com/u/20542?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/nathanhammond",
            "html_url": "https://github.com/nathanhammond",
            "followers_url": "https://api.github.com/users/nathanhammond/followers",
            "following_url": "https://api.github.com/users/nathanhammond/following{/other_user}",
            "gists_url": "https://api.github.com/users/nathanhammond/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/nathanhammond/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/nathanhammond/subscriptions",
            "organizations_url": "https://api.github.com/users/nathanhammond/orgs",
            "repos_url": "https://api.github.com/users/nathanhammond/repos",
            "events_url": "https://api.github.com/users/nathanhammond/events{/privacy}",
            "received_events_url": "https://api.github.com/users/nathanhammond/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8"
            },
            {
              "sha": "17864d224fcee511c1034488872fae0923881b6f",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/17864d224fcee511c1034488872fae0923881b6f",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/17864d224fcee511c1034488872fae0923881b6f"
            }
          ]
        },
        {
          "sha": "0d635e9f811d5ad61493681421fb26480b7827f2",
          "commit": {
            "author": {
              "name": "Nathan Hammond",
              "email": "github.com@nathanhammond.com",
              "date": "2016-06-10T07:46:32Z"
            },
            "committer": {
              "name": "Nathan Hammond",
              "email": "github.com@nathanhammond.com",
              "date": "2016-06-10T07:46:32Z"
            },
            "message": "Release v2.6.0",
            "tree": {
              "sha": "51af03fd3b7fe642053992e6a6a7c6f003d2370a",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/51af03fd3b7fe642053992e6a6a7c6f003d2370a"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/0d635e9f811d5ad61493681421fb26480b7827f2",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/0d635e9f811d5ad61493681421fb26480b7827f2",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/0d635e9f811d5ad61493681421fb26480b7827f2",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/0d635e9f811d5ad61493681421fb26480b7827f2/comments",
          "author": {
            "login": "nathanhammond",
            "id": 20542,
            "avatar_url": "https://avatars.githubusercontent.com/u/20542?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/nathanhammond",
            "html_url": "https://github.com/nathanhammond",
            "followers_url": "https://api.github.com/users/nathanhammond/followers",
            "following_url": "https://api.github.com/users/nathanhammond/following{/other_user}",
            "gists_url": "https://api.github.com/users/nathanhammond/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/nathanhammond/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/nathanhammond/subscriptions",
            "organizations_url": "https://api.github.com/users/nathanhammond/orgs",
            "repos_url": "https://api.github.com/users/nathanhammond/repos",
            "events_url": "https://api.github.com/users/nathanhammond/events{/privacy}",
            "received_events_url": "https://api.github.com/users/nathanhammond/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "nathanhammond",
            "id": 20542,
            "avatar_url": "https://avatars.githubusercontent.com/u/20542?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/nathanhammond",
            "html_url": "https://github.com/nathanhammond",
            "followers_url": "https://api.github.com/users/nathanhammond/followers",
            "following_url": "https://api.github.com/users/nathanhammond/following{/other_user}",
            "gists_url": "https://api.github.com/users/nathanhammond/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/nathanhammond/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/nathanhammond/subscriptions",
            "organizations_url": "https://api.github.com/users/nathanhammond/orgs",
            "repos_url": "https://api.github.com/users/nathanhammond/repos",
            "events_url": "https://api.github.com/users/nathanhammond/events{/privacy}",
            "received_events_url": "https://api.github.com/users/nathanhammond/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8"
            }
          ]
        },
        {
          "sha": "c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8",
          "commit": {
            "author": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-09T21:54:37Z"
            },
            "committer": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-09T21:54:37Z"
            },
            "message": "Auto merge of #5963 - Turbo87:fix-npm-module-name-parsing, r=nathanhammond\n\nFix reading npm package names with a version specifier\n\nThis PR finishes https://github.com/ember-cli/ember-cli/pull/5883 and moves it to the `beta` branch.\n\nResolves #5880\n\n/cc @martndemus @nathanhammond @mike-north @stefanpenner @rwjblue",
            "tree": {
              "sha": "397ae0a59f14cf5d376794b33e755ee658faba7c",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/397ae0a59f14cf5d376794b33e755ee658faba7c"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/c57d8c6a07f9f2cbc98f2d4d4173d8e56fe98aa8/comments",
          "author": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "81306ebf3d046cdfc6ccee9a71781235e863da62",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/81306ebf3d046cdfc6ccee9a71781235e863da62",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/81306ebf3d046cdfc6ccee9a71781235e863da62"
            },
            {
              "sha": "8ca709d329182cb059dcdb5338bea0363436ffb8",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8ca709d329182cb059dcdb5338bea0363436ffb8",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/8ca709d329182cb059dcdb5338bea0363436ffb8"
            }
          ]
        },
        {
          "sha": "8ca709d329182cb059dcdb5338bea0363436ffb8",
          "commit": {
            "author": {
              "name": "Tobias Bieniek",
              "email": "tobias.bieniek@gmail.com",
              "date": "2016-06-09T16:11:28Z"
            },
            "committer": {
              "name": "Tobias Bieniek",
              "email": "tobias.bieniek@gmail.com",
              "date": "2016-06-09T16:12:25Z"
            },
            "message": "models/project: Use only exact matches in findAddonByName()",
            "tree": {
              "sha": "397ae0a59f14cf5d376794b33e755ee658faba7c",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/397ae0a59f14cf5d376794b33e755ee658faba7c"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/8ca709d329182cb059dcdb5338bea0363436ffb8",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8ca709d329182cb059dcdb5338bea0363436ffb8",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/8ca709d329182cb059dcdb5338bea0363436ffb8",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8ca709d329182cb059dcdb5338bea0363436ffb8/comments",
          "author": {
            "login": "Turbo87",
            "id": 141300,
            "avatar_url": "https://avatars.githubusercontent.com/u/141300?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/Turbo87",
            "html_url": "https://github.com/Turbo87",
            "followers_url": "https://api.github.com/users/Turbo87/followers",
            "following_url": "https://api.github.com/users/Turbo87/following{/other_user}",
            "gists_url": "https://api.github.com/users/Turbo87/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/Turbo87/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/Turbo87/subscriptions",
            "organizations_url": "https://api.github.com/users/Turbo87/orgs",
            "repos_url": "https://api.github.com/users/Turbo87/repos",
            "events_url": "https://api.github.com/users/Turbo87/events{/privacy}",
            "received_events_url": "https://api.github.com/users/Turbo87/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "Turbo87",
            "id": 141300,
            "avatar_url": "https://avatars.githubusercontent.com/u/141300?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/Turbo87",
            "html_url": "https://github.com/Turbo87",
            "followers_url": "https://api.github.com/users/Turbo87/followers",
            "following_url": "https://api.github.com/users/Turbo87/following{/other_user}",
            "gists_url": "https://api.github.com/users/Turbo87/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/Turbo87/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/Turbo87/subscriptions",
            "organizations_url": "https://api.github.com/users/Turbo87/orgs",
            "repos_url": "https://api.github.com/users/Turbo87/repos",
            "events_url": "https://api.github.com/users/Turbo87/events{/privacy}",
            "received_events_url": "https://api.github.com/users/Turbo87/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "1feae3cbf7f465cf16d4c8af164d84638a5d3fd1",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/1feae3cbf7f465cf16d4c8af164d84638a5d3fd1",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/1feae3cbf7f465cf16d4c8af164d84638a5d3fd1"
            }
          ]
        },
        {
          "sha": "1feae3cbf7f465cf16d4c8af164d84638a5d3fd1",
          "commit": {
            "author": {
              "name": "Tobias Bieniek",
              "email": "tobias.bieniek@gmail.com",
              "date": "2016-06-09T16:07:28Z"
            },
            "committer": {
              "name": "Tobias Bieniek",
              "email": "tobias.bieniek@gmail.com",
              "date": "2016-06-09T16:12:24Z"
            },
            "message": "tasks/addon-install: Use getPackageBaseName() in findDefaultBlueprintName()\n\nThis will show a warning if a blueprint name could not be found, but will not fail the entire build",
            "tree": {
              "sha": "e7f31437493c73fd10d23adc432b30defc628a49",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/e7f31437493c73fd10d23adc432b30defc628a49"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/1feae3cbf7f465cf16d4c8af164d84638a5d3fd1",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/1feae3cbf7f465cf16d4c8af164d84638a5d3fd1",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/1feae3cbf7f465cf16d4c8af164d84638a5d3fd1",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/1feae3cbf7f465cf16d4c8af164d84638a5d3fd1/comments",
          "author": {
            "login": "Turbo87",
            "id": 141300,
            "avatar_url": "https://avatars.githubusercontent.com/u/141300?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/Turbo87",
            "html_url": "https://github.com/Turbo87",
            "followers_url": "https://api.github.com/users/Turbo87/followers",
            "following_url": "https://api.github.com/users/Turbo87/following{/other_user}",
            "gists_url": "https://api.github.com/users/Turbo87/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/Turbo87/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/Turbo87/subscriptions",
            "organizations_url": "https://api.github.com/users/Turbo87/orgs",
            "repos_url": "https://api.github.com/users/Turbo87/repos",
            "events_url": "https://api.github.com/users/Turbo87/events{/privacy}",
            "received_events_url": "https://api.github.com/users/Turbo87/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "Turbo87",
            "id": 141300,
            "avatar_url": "https://avatars.githubusercontent.com/u/141300?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/Turbo87",
            "html_url": "https://github.com/Turbo87",
            "followers_url": "https://api.github.com/users/Turbo87/followers",
            "following_url": "https://api.github.com/users/Turbo87/following{/other_user}",
            "gists_url": "https://api.github.com/users/Turbo87/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/Turbo87/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/Turbo87/subscriptions",
            "organizations_url": "https://api.github.com/users/Turbo87/orgs",
            "repos_url": "https://api.github.com/users/Turbo87/repos",
            "events_url": "https://api.github.com/users/Turbo87/events{/privacy}",
            "received_events_url": "https://api.github.com/users/Turbo87/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "903105dbd4b60aad098af22867369d45ecc7f6bf",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/903105dbd4b60aad098af22867369d45ecc7f6bf",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/903105dbd4b60aad098af22867369d45ecc7f6bf"
            }
          ]
        },
        {
          "sha": "903105dbd4b60aad098af22867369d45ecc7f6bf",
          "commit": {
            "author": {
              "name": "Marten Schilstra",
              "email": "mail@martenschilstra.nl",
              "date": "2016-06-09T15:31:57Z"
            },
            "committer": {
              "name": "Tobias Bieniek",
              "email": "tobias.bieniek@gmail.com",
              "date": "2016-06-09T16:12:22Z"
            },
            "message": "utilities/get-package-base-name: Add version stripping unit test",
            "tree": {
              "sha": "fb6dba3caa54c15148650709cd51cf910605466a",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/fb6dba3caa54c15148650709cd51cf910605466a"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/903105dbd4b60aad098af22867369d45ecc7f6bf",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/903105dbd4b60aad098af22867369d45ecc7f6bf",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/903105dbd4b60aad098af22867369d45ecc7f6bf",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/903105dbd4b60aad098af22867369d45ecc7f6bf/comments",
          "author": {
            "login": "martndemus",
            "id": 903637,
            "avatar_url": "https://avatars.githubusercontent.com/u/903637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/martndemus",
            "html_url": "https://github.com/martndemus",
            "followers_url": "https://api.github.com/users/martndemus/followers",
            "following_url": "https://api.github.com/users/martndemus/following{/other_user}",
            "gists_url": "https://api.github.com/users/martndemus/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/martndemus/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/martndemus/subscriptions",
            "organizations_url": "https://api.github.com/users/martndemus/orgs",
            "repos_url": "https://api.github.com/users/martndemus/repos",
            "events_url": "https://api.github.com/users/martndemus/events{/privacy}",
            "received_events_url": "https://api.github.com/users/martndemus/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "Turbo87",
            "id": 141300,
            "avatar_url": "https://avatars.githubusercontent.com/u/141300?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/Turbo87",
            "html_url": "https://github.com/Turbo87",
            "followers_url": "https://api.github.com/users/Turbo87/followers",
            "following_url": "https://api.github.com/users/Turbo87/following{/other_user}",
            "gists_url": "https://api.github.com/users/Turbo87/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/Turbo87/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/Turbo87/subscriptions",
            "organizations_url": "https://api.github.com/users/Turbo87/orgs",
            "repos_url": "https://api.github.com/users/Turbo87/repos",
            "events_url": "https://api.github.com/users/Turbo87/events{/privacy}",
            "received_events_url": "https://api.github.com/users/Turbo87/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "5d5e6a5d4cd9e7138e07b2a7d68884ed407ec2e2",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/5d5e6a5d4cd9e7138e07b2a7d68884ed407ec2e2",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/5d5e6a5d4cd9e7138e07b2a7d68884ed407ec2e2"
            }
          ]
        },
        {
          "sha": "5d5e6a5d4cd9e7138e07b2a7d68884ed407ec2e2",
          "commit": {
            "author": {
              "name": "Marten Schilstra",
              "email": "mail@martenschilstra.nl",
              "date": "2016-06-09T15:31:40Z"
            },
            "committer": {
              "name": "Tobias Bieniek",
              "email": "tobias.bieniek@gmail.com",
              "date": "2016-06-09T16:12:15Z"
            },
            "message": "utilities/get-package-base-name: Use \"npm-package-arg\" to parse names",
            "tree": {
              "sha": "2dc46214052b1d4d1ebc7ecc419a24c175e554bb",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/2dc46214052b1d4d1ebc7ecc419a24c175e554bb"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/5d5e6a5d4cd9e7138e07b2a7d68884ed407ec2e2",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/5d5e6a5d4cd9e7138e07b2a7d68884ed407ec2e2",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/5d5e6a5d4cd9e7138e07b2a7d68884ed407ec2e2",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/5d5e6a5d4cd9e7138e07b2a7d68884ed407ec2e2/comments",
          "author": {
            "login": "martndemus",
            "id": 903637,
            "avatar_url": "https://avatars.githubusercontent.com/u/903637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/martndemus",
            "html_url": "https://github.com/martndemus",
            "followers_url": "https://api.github.com/users/martndemus/followers",
            "following_url": "https://api.github.com/users/martndemus/following{/other_user}",
            "gists_url": "https://api.github.com/users/martndemus/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/martndemus/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/martndemus/subscriptions",
            "organizations_url": "https://api.github.com/users/martndemus/orgs",
            "repos_url": "https://api.github.com/users/martndemus/repos",
            "events_url": "https://api.github.com/users/martndemus/events{/privacy}",
            "received_events_url": "https://api.github.com/users/martndemus/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "Turbo87",
            "id": 141300,
            "avatar_url": "https://avatars.githubusercontent.com/u/141300?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/Turbo87",
            "html_url": "https://github.com/Turbo87",
            "followers_url": "https://api.github.com/users/Turbo87/followers",
            "following_url": "https://api.github.com/users/Turbo87/following{/other_user}",
            "gists_url": "https://api.github.com/users/Turbo87/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/Turbo87/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/Turbo87/subscriptions",
            "organizations_url": "https://api.github.com/users/Turbo87/orgs",
            "repos_url": "https://api.github.com/users/Turbo87/repos",
            "events_url": "https://api.github.com/users/Turbo87/events{/privacy}",
            "received_events_url": "https://api.github.com/users/Turbo87/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "81306ebf3d046cdfc6ccee9a71781235e863da62",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/81306ebf3d046cdfc6ccee9a71781235e863da62",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/81306ebf3d046cdfc6ccee9a71781235e863da62"
            }
          ]
        },
        {
          "sha": "4687fe353ad12cf9ed2ccd224d74f88c3532ff6f",
          "commit": {
            "author": {
              "name": "Josemar Luedke",
              "email": "josemarluedke@gmail.com",
              "date": "2016-06-09T02:36:36Z"
            },
            "committer": {
              "name": "Josemar Luedke",
              "email": "josemarluedke@gmail.com",
              "date": "2016-06-09T02:36:36Z"
            },
            "message": "Remove test-loader from tests/index blueprint",
            "tree": {
              "sha": "4983c530f5733697f2e763faf5988c2e88cb2efa",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/4983c530f5733697f2e763faf5988c2e88cb2efa"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/4687fe353ad12cf9ed2ccd224d74f88c3532ff6f",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/4687fe353ad12cf9ed2ccd224d74f88c3532ff6f",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/4687fe353ad12cf9ed2ccd224d74f88c3532ff6f",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/4687fe353ad12cf9ed2ccd224d74f88c3532ff6f/comments",
          "author": {
            "login": "josemarluedke",
            "id": 230476,
            "avatar_url": "https://avatars.githubusercontent.com/u/230476?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/josemarluedke",
            "html_url": "https://github.com/josemarluedke",
            "followers_url": "https://api.github.com/users/josemarluedke/followers",
            "following_url": "https://api.github.com/users/josemarluedke/following{/other_user}",
            "gists_url": "https://api.github.com/users/josemarluedke/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/josemarluedke/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/josemarluedke/subscriptions",
            "organizations_url": "https://api.github.com/users/josemarluedke/orgs",
            "repos_url": "https://api.github.com/users/josemarluedke/repos",
            "events_url": "https://api.github.com/users/josemarluedke/events{/privacy}",
            "received_events_url": "https://api.github.com/users/josemarluedke/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "josemarluedke",
            "id": 230476,
            "avatar_url": "https://avatars.githubusercontent.com/u/230476?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/josemarluedke",
            "html_url": "https://github.com/josemarluedke",
            "followers_url": "https://api.github.com/users/josemarluedke/followers",
            "following_url": "https://api.github.com/users/josemarluedke/following{/other_user}",
            "gists_url": "https://api.github.com/users/josemarluedke/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/josemarluedke/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/josemarluedke/subscriptions",
            "organizations_url": "https://api.github.com/users/josemarluedke/orgs",
            "repos_url": "https://api.github.com/users/josemarluedke/repos",
            "events_url": "https://api.github.com/users/josemarluedke/events{/privacy}",
            "received_events_url": "https://api.github.com/users/josemarluedke/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "17864d224fcee511c1034488872fae0923881b6f",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/17864d224fcee511c1034488872fae0923881b6f",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/17864d224fcee511c1034488872fae0923881b6f"
            }
          ]
        },
        {
          "sha": "17864d224fcee511c1034488872fae0923881b6f",
          "commit": {
            "author": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-08T22:55:50Z"
            },
            "committer": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-08T22:55:50Z"
            },
            "message": "Auto merge of #5961 - ember-cli:update-ember-2-7, r=rwjblue\n\nUpdate Ember in master / next beta to 2.7.0-beta.1.\n\nNone",
            "tree": {
              "sha": "83f52ab7f43fc65aeacfe4124477e6ffe5ddef16",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/83f52ab7f43fc65aeacfe4124477e6ffe5ddef16"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/17864d224fcee511c1034488872fae0923881b6f",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/17864d224fcee511c1034488872fae0923881b6f",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/17864d224fcee511c1034488872fae0923881b6f",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/17864d224fcee511c1034488872fae0923881b6f/comments",
          "author": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "2046ace5776b69bdabd296291bb63536c8240129",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/2046ace5776b69bdabd296291bb63536c8240129",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/2046ace5776b69bdabd296291bb63536c8240129"
            },
            {
              "sha": "b18e8418aa1d11eca85dcd75d0893afb9a3d9667",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/b18e8418aa1d11eca85dcd75d0893afb9a3d9667",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/b18e8418aa1d11eca85dcd75d0893afb9a3d9667"
            }
          ]
        },
        {
          "sha": "2046ace5776b69bdabd296291bb63536c8240129",
          "commit": {
            "author": {
              "name": "Robert Jackson",
              "email": "me@rwjblue.com",
              "date": "2016-06-08T22:55:36Z"
            },
            "committer": {
              "name": "Robert Jackson",
              "email": "me@rwjblue.com",
              "date": "2016-06-08T22:55:36Z"
            },
            "message": "Merge pull request #5960 from bmac/patch-5\n\nUpdate Ember Data to v2.7.0-beta.1",
            "tree": {
              "sha": "c2f5908aeb23b9c7a85bea138e9c87544a0d1664",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/c2f5908aeb23b9c7a85bea138e9c87544a0d1664"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/2046ace5776b69bdabd296291bb63536c8240129",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/2046ace5776b69bdabd296291bb63536c8240129",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/2046ace5776b69bdabd296291bb63536c8240129",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/2046ace5776b69bdabd296291bb63536c8240129/comments",
          "author": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "8d02f0f8717de9e975a1e520a3544c65ccc127f5",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8d02f0f8717de9e975a1e520a3544c65ccc127f5",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/8d02f0f8717de9e975a1e520a3544c65ccc127f5"
            },
            {
              "sha": "ab51939ec07af364e31ee51af66a68750cb374cb",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/ab51939ec07af364e31ee51af66a68750cb374cb",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/ab51939ec07af364e31ee51af66a68750cb374cb"
            }
          ]
        },
        {
          "sha": "81306ebf3d046cdfc6ccee9a71781235e863da62",
          "commit": {
            "author": {
              "name": "Robert Jackson",
              "email": "me@rwjblue.com",
              "date": "2016-06-08T22:13:27Z"
            },
            "committer": {
              "name": "Robert Jackson",
              "email": "me@rwjblue.com",
              "date": "2016-06-08T22:13:27Z"
            },
            "message": "Merge pull request #5959 from bmac/patch-4\n\n[BUGFIX beta] Update the ember-data dependency to 2.6.0",
            "tree": {
              "sha": "20b3c39155b39ee7e93f25a6823194cdaf8cd7e5",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/20b3c39155b39ee7e93f25a6823194cdaf8cd7e5"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/81306ebf3d046cdfc6ccee9a71781235e863da62",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/81306ebf3d046cdfc6ccee9a71781235e863da62",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/81306ebf3d046cdfc6ccee9a71781235e863da62",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/81306ebf3d046cdfc6ccee9a71781235e863da62/comments",
          "author": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "1c1ebdfdc08f0da75befda5999ced885c5da54cc",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/1c1ebdfdc08f0da75befda5999ced885c5da54cc",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/1c1ebdfdc08f0da75befda5999ced885c5da54cc"
            },
            {
              "sha": "87c780701fd617dd17dc32d3064ce22b16435f49",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/87c780701fd617dd17dc32d3064ce22b16435f49",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/87c780701fd617dd17dc32d3064ce22b16435f49"
            }
          ]
        },
        {
          "sha": "b18e8418aa1d11eca85dcd75d0893afb9a3d9667",
          "commit": {
            "author": {
              "name": "Robert Jackson",
              "email": "robert.w.jackson@me.com",
              "date": "2016-06-08T21:55:52Z"
            },
            "committer": {
              "name": "Robert Jackson",
              "email": "robert.w.jackson@me.com",
              "date": "2016-06-08T21:55:52Z"
            },
            "message": "Update Ember in master / next beta to 2.7.0-beta.1.",
            "tree": {
              "sha": "b7973ab6cfc80aa5dacfa1989e60687426fc3fe7",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/b7973ab6cfc80aa5dacfa1989e60687426fc3fe7"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/b18e8418aa1d11eca85dcd75d0893afb9a3d9667",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/b18e8418aa1d11eca85dcd75d0893afb9a3d9667",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/b18e8418aa1d11eca85dcd75d0893afb9a3d9667",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/b18e8418aa1d11eca85dcd75d0893afb9a3d9667/comments",
          "author": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "8d02f0f8717de9e975a1e520a3544c65ccc127f5",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8d02f0f8717de9e975a1e520a3544c65ccc127f5",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/8d02f0f8717de9e975a1e520a3544c65ccc127f5"
            }
          ]
        },
        {
          "sha": "ab51939ec07af364e31ee51af66a68750cb374cb",
          "commit": {
            "author": {
              "name": "Brendan McLoughlin",
              "email": "bmac@users.noreply.github.com",
              "date": "2016-06-08T21:53:08Z"
            },
            "committer": {
              "name": "Brendan McLoughlin",
              "email": "bmac@users.noreply.github.com",
              "date": "2016-06-08T21:53:08Z"
            },
            "message": "Update Ember Data to v2.7.0-beta.1",
            "tree": {
              "sha": "c2f5908aeb23b9c7a85bea138e9c87544a0d1664",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/c2f5908aeb23b9c7a85bea138e9c87544a0d1664"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/ab51939ec07af364e31ee51af66a68750cb374cb",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/ab51939ec07af364e31ee51af66a68750cb374cb",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/ab51939ec07af364e31ee51af66a68750cb374cb",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/ab51939ec07af364e31ee51af66a68750cb374cb/comments",
          "author": {
            "login": "bmac",
            "id": 54056,
            "avatar_url": "https://avatars.githubusercontent.com/u/54056?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/bmac",
            "html_url": "https://github.com/bmac",
            "followers_url": "https://api.github.com/users/bmac/followers",
            "following_url": "https://api.github.com/users/bmac/following{/other_user}",
            "gists_url": "https://api.github.com/users/bmac/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/bmac/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/bmac/subscriptions",
            "organizations_url": "https://api.github.com/users/bmac/orgs",
            "repos_url": "https://api.github.com/users/bmac/repos",
            "events_url": "https://api.github.com/users/bmac/events{/privacy}",
            "received_events_url": "https://api.github.com/users/bmac/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "bmac",
            "id": 54056,
            "avatar_url": "https://avatars.githubusercontent.com/u/54056?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/bmac",
            "html_url": "https://github.com/bmac",
            "followers_url": "https://api.github.com/users/bmac/followers",
            "following_url": "https://api.github.com/users/bmac/following{/other_user}",
            "gists_url": "https://api.github.com/users/bmac/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/bmac/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/bmac/subscriptions",
            "organizations_url": "https://api.github.com/users/bmac/orgs",
            "repos_url": "https://api.github.com/users/bmac/repos",
            "events_url": "https://api.github.com/users/bmac/events{/privacy}",
            "received_events_url": "https://api.github.com/users/bmac/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "8d02f0f8717de9e975a1e520a3544c65ccc127f5",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8d02f0f8717de9e975a1e520a3544c65ccc127f5",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/8d02f0f8717de9e975a1e520a3544c65ccc127f5"
            }
          ]
        },
        {
          "sha": "87c780701fd617dd17dc32d3064ce22b16435f49",
          "commit": {
            "author": {
              "name": "Brendan McLoughlin",
              "email": "bmac@users.noreply.github.com",
              "date": "2016-06-08T21:36:56Z"
            },
            "committer": {
              "name": "Brendan McLoughlin",
              "email": "bmac@users.noreply.github.com",
              "date": "2016-06-08T21:36:56Z"
            },
            "message": "[BUGFIX beta] Update the ember-data dependency to 2.6.0",
            "tree": {
              "sha": "20b3c39155b39ee7e93f25a6823194cdaf8cd7e5",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/20b3c39155b39ee7e93f25a6823194cdaf8cd7e5"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/87c780701fd617dd17dc32d3064ce22b16435f49",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/87c780701fd617dd17dc32d3064ce22b16435f49",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/87c780701fd617dd17dc32d3064ce22b16435f49",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/87c780701fd617dd17dc32d3064ce22b16435f49/comments",
          "author": {
            "login": "bmac",
            "id": 54056,
            "avatar_url": "https://avatars.githubusercontent.com/u/54056?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/bmac",
            "html_url": "https://github.com/bmac",
            "followers_url": "https://api.github.com/users/bmac/followers",
            "following_url": "https://api.github.com/users/bmac/following{/other_user}",
            "gists_url": "https://api.github.com/users/bmac/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/bmac/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/bmac/subscriptions",
            "organizations_url": "https://api.github.com/users/bmac/orgs",
            "repos_url": "https://api.github.com/users/bmac/repos",
            "events_url": "https://api.github.com/users/bmac/events{/privacy}",
            "received_events_url": "https://api.github.com/users/bmac/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "bmac",
            "id": 54056,
            "avatar_url": "https://avatars.githubusercontent.com/u/54056?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/bmac",
            "html_url": "https://github.com/bmac",
            "followers_url": "https://api.github.com/users/bmac/followers",
            "following_url": "https://api.github.com/users/bmac/following{/other_user}",
            "gists_url": "https://api.github.com/users/bmac/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/bmac/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/bmac/subscriptions",
            "organizations_url": "https://api.github.com/users/bmac/orgs",
            "repos_url": "https://api.github.com/users/bmac/repos",
            "events_url": "https://api.github.com/users/bmac/events{/privacy}",
            "received_events_url": "https://api.github.com/users/bmac/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "1c1ebdfdc08f0da75befda5999ced885c5da54cc",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/1c1ebdfdc08f0da75befda5999ced885c5da54cc",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/1c1ebdfdc08f0da75befda5999ced885c5da54cc"
            }
          ]
        },
        {
          "sha": "1c1ebdfdc08f0da75befda5999ced885c5da54cc",
          "commit": {
            "author": {
              "name": "Robert Jackson",
              "email": "me@rwjblue.com",
              "date": "2016-06-08T18:43:12Z"
            },
            "committer": {
              "name": "Robert Jackson",
              "email": "me@rwjblue.com",
              "date": "2016-06-08T18:43:12Z"
            },
            "message": "Merge pull request #5957 from rwjblue/update-ember-version\n\nUpdate Ember version to 2.6.0.",
            "tree": {
              "sha": "2bc0435e54c2537ec5761604e0e7051559a2ce15",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/2bc0435e54c2537ec5761604e0e7051559a2ce15"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/1c1ebdfdc08f0da75befda5999ced885c5da54cc",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/1c1ebdfdc08f0da75befda5999ced885c5da54cc",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/1c1ebdfdc08f0da75befda5999ced885c5da54cc",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/1c1ebdfdc08f0da75befda5999ced885c5da54cc/comments",
          "author": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "45165ae30f9a0b3c3360355320e80f3ea9bd141c",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/45165ae30f9a0b3c3360355320e80f3ea9bd141c",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/45165ae30f9a0b3c3360355320e80f3ea9bd141c"
            },
            {
              "sha": "bce35eaef8aaccecb9c3375d0e6ebe995bb8644b",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/bce35eaef8aaccecb9c3375d0e6ebe995bb8644b",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/bce35eaef8aaccecb9c3375d0e6ebe995bb8644b"
            }
          ]
        },
        {
          "sha": "bce35eaef8aaccecb9c3375d0e6ebe995bb8644b",
          "commit": {
            "author": {
              "name": "Robert Jackson",
              "email": "robert.w.jackson@me.com",
              "date": "2016-06-08T17:24:46Z"
            },
            "committer": {
              "name": "Robert Jackson",
              "email": "robert.w.jackson@me.com",
              "date": "2016-06-08T17:24:46Z"
            },
            "message": "Update Ember version to 2.6.0.",
            "tree": {
              "sha": "2bc0435e54c2537ec5761604e0e7051559a2ce15",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/2bc0435e54c2537ec5761604e0e7051559a2ce15"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/bce35eaef8aaccecb9c3375d0e6ebe995bb8644b",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/bce35eaef8aaccecb9c3375d0e6ebe995bb8644b",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/bce35eaef8aaccecb9c3375d0e6ebe995bb8644b",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/bce35eaef8aaccecb9c3375d0e6ebe995bb8644b/comments",
          "author": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "45165ae30f9a0b3c3360355320e80f3ea9bd141c",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/45165ae30f9a0b3c3360355320e80f3ea9bd141c",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/45165ae30f9a0b3c3360355320e80f3ea9bd141c"
            }
          ]
        },
        {
          "sha": "45165ae30f9a0b3c3360355320e80f3ea9bd141c",
          "commit": {
            "author": {
              "name": "Robert Jackson",
              "email": "me@rwjblue.com",
              "date": "2016-06-06T13:50:00Z"
            },
            "committer": {
              "name": "Tobias Bieniek",
              "email": "tobias.bieniek@gmail.com",
              "date": "2016-06-07T07:18:29Z"
            },
            "message": "[BUGFIX beta] Fix addon linting regression.",
            "tree": {
              "sha": "f333b41f25e3ff521cba59fde79ea3fa3c9e3d7f",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/f333b41f25e3ff521cba59fde79ea3fa3c9e3d7f"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/45165ae30f9a0b3c3360355320e80f3ea9bd141c",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/45165ae30f9a0b3c3360355320e80f3ea9bd141c",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/45165ae30f9a0b3c3360355320e80f3ea9bd141c",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/45165ae30f9a0b3c3360355320e80f3ea9bd141c/comments",
          "author": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "Turbo87",
            "id": 141300,
            "avatar_url": "https://avatars.githubusercontent.com/u/141300?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/Turbo87",
            "html_url": "https://github.com/Turbo87",
            "followers_url": "https://api.github.com/users/Turbo87/followers",
            "following_url": "https://api.github.com/users/Turbo87/following{/other_user}",
            "gists_url": "https://api.github.com/users/Turbo87/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/Turbo87/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/Turbo87/subscriptions",
            "organizations_url": "https://api.github.com/users/Turbo87/orgs",
            "repos_url": "https://api.github.com/users/Turbo87/repos",
            "events_url": "https://api.github.com/users/Turbo87/events{/privacy}",
            "received_events_url": "https://api.github.com/users/Turbo87/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "ab3980659b40e6012904d9fc0e3cc8b71ae7f18d",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/ab3980659b40e6012904d9fc0e3cc8b71ae7f18d",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/ab3980659b40e6012904d9fc0e3cc8b71ae7f18d"
            }
          ]
        },
        {
          "sha": "8d02f0f8717de9e975a1e520a3544c65ccc127f5",
          "commit": {
            "author": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-07T07:17:10Z"
            },
            "committer": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-07T07:17:10Z"
            },
            "message": "Auto merge of #5955 - ember-cli:rwjblue-patch-1, r=Turbo87\n\n[BUGFIX beta] Fix addon linting regression.\n\nThis was originally fixed in https://github.com/ember-cli/ember-cli/pull/5592, but likely regressed during the \"great core-object migration of 2016\" (:smiling_imp:). https://github.com/ember-cli/ember-cli/issues/5498 contains a good description of why using `eachAddonInvoke` doesn't work and shows the reasoning behind `_eachProjectAddonInvoke`.",
            "tree": {
              "sha": "62096eb9ef64557198e72c57f8af2fcb46eb2dbd",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/62096eb9ef64557198e72c57f8af2fcb46eb2dbd"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/8d02f0f8717de9e975a1e520a3544c65ccc127f5",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8d02f0f8717de9e975a1e520a3544c65ccc127f5",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/8d02f0f8717de9e975a1e520a3544c65ccc127f5",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/8d02f0f8717de9e975a1e520a3544c65ccc127f5/comments",
          "author": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "3e36e07da88dd217524b2eedd37a87f7a998562d",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/3e36e07da88dd217524b2eedd37a87f7a998562d",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/3e36e07da88dd217524b2eedd37a87f7a998562d"
            },
            {
              "sha": "9f470f217e3079148f4043078ce22d28e3f8fe1f",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/9f470f217e3079148f4043078ce22d28e3f8fe1f",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/9f470f217e3079148f4043078ce22d28e3f8fe1f"
            }
          ]
        },
        {
          "sha": "9f470f217e3079148f4043078ce22d28e3f8fe1f",
          "commit": {
            "author": {
              "name": "Robert Jackson",
              "email": "me@rwjblue.com",
              "date": "2016-06-06T13:50:00Z"
            },
            "committer": {
              "name": "Robert Jackson",
              "email": "me@rwjblue.com",
              "date": "2016-06-06T13:50:00Z"
            },
            "message": "[BUGFIX beta] Fix addon linting regression.",
            "tree": {
              "sha": "62096eb9ef64557198e72c57f8af2fcb46eb2dbd",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/62096eb9ef64557198e72c57f8af2fcb46eb2dbd"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/9f470f217e3079148f4043078ce22d28e3f8fe1f",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/9f470f217e3079148f4043078ce22d28e3f8fe1f",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/9f470f217e3079148f4043078ce22d28e3f8fe1f",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/9f470f217e3079148f4043078ce22d28e3f8fe1f/comments",
          "author": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "rwjblue",
            "id": 12637,
            "avatar_url": "https://avatars.githubusercontent.com/u/12637?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/rwjblue",
            "html_url": "https://github.com/rwjblue",
            "followers_url": "https://api.github.com/users/rwjblue/followers",
            "following_url": "https://api.github.com/users/rwjblue/following{/other_user}",
            "gists_url": "https://api.github.com/users/rwjblue/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/rwjblue/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/rwjblue/subscriptions",
            "organizations_url": "https://api.github.com/users/rwjblue/orgs",
            "repos_url": "https://api.github.com/users/rwjblue/repos",
            "events_url": "https://api.github.com/users/rwjblue/events{/privacy}",
            "received_events_url": "https://api.github.com/users/rwjblue/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "3e36e07da88dd217524b2eedd37a87f7a998562d",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/3e36e07da88dd217524b2eedd37a87f7a998562d",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/3e36e07da88dd217524b2eedd37a87f7a998562d"
            }
          ]
        },
        {
          "sha": "3e36e07da88dd217524b2eedd37a87f7a998562d",
          "commit": {
            "author": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-03T12:41:10Z"
            },
            "committer": {
              "name": "Homu",
              "email": "homu@barosl.com",
              "date": "2016-06-03T12:41:10Z"
            },
            "message": "Auto merge of #5951 - johanneswuerbach:patch-2, r=rwjblue\n\nUnpin testem\n\nThe spawning issue has been resolved in testem `v1.8.1`.\n\nReverts https://github.com/ember-cli/ember-cli/pull/5948\n\n//cc @chadhietala",
            "tree": {
              "sha": "407b9b18b910c91276c6712416edcc05c226d5c7",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/407b9b18b910c91276c6712416edcc05c226d5c7"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/3e36e07da88dd217524b2eedd37a87f7a998562d",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/3e36e07da88dd217524b2eedd37a87f7a998562d",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/3e36e07da88dd217524b2eedd37a87f7a998562d",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/3e36e07da88dd217524b2eedd37a87f7a998562d/comments",
          "author": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "homu",
            "id": 10212162,
            "avatar_url": "https://avatars.githubusercontent.com/u/10212162?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/homu",
            "html_url": "https://github.com/homu",
            "followers_url": "https://api.github.com/users/homu/followers",
            "following_url": "https://api.github.com/users/homu/following{/other_user}",
            "gists_url": "https://api.github.com/users/homu/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/homu/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/homu/subscriptions",
            "organizations_url": "https://api.github.com/users/homu/orgs",
            "repos_url": "https://api.github.com/users/homu/repos",
            "events_url": "https://api.github.com/users/homu/events{/privacy}",
            "received_events_url": "https://api.github.com/users/homu/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "d507aa2fbed58b41a7798c60b3c6e0135388f544",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/d507aa2fbed58b41a7798c60b3c6e0135388f544",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/d507aa2fbed58b41a7798c60b3c6e0135388f544"
            },
            {
              "sha": "aeb79bec3162f28778f3a38c13317fe56439826d",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/aeb79bec3162f28778f3a38c13317fe56439826d",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/aeb79bec3162f28778f3a38c13317fe56439826d"
            }
          ]
        },
        {
          "sha": "aeb79bec3162f28778f3a38c13317fe56439826d",
          "commit": {
            "author": {
              "name": "Johannes Würbach",
              "email": "johannes.wuerbach@googlemail.com",
              "date": "2016-06-03T12:10:53Z"
            },
            "committer": {
              "name": "Johannes Würbach",
              "email": "johannes.wuerbach@googlemail.com",
              "date": "2016-06-03T12:10:53Z"
            },
            "message": "Unpin testem\n\nThe spawning issue has been resolved in testem `v1.8.1`.",
            "tree": {
              "sha": "407b9b18b910c91276c6712416edcc05c226d5c7",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/407b9b18b910c91276c6712416edcc05c226d5c7"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/aeb79bec3162f28778f3a38c13317fe56439826d",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/aeb79bec3162f28778f3a38c13317fe56439826d",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/aeb79bec3162f28778f3a38c13317fe56439826d",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/aeb79bec3162f28778f3a38c13317fe56439826d/comments",
          "author": {
            "login": "johanneswuerbach",
            "id": 864578,
            "avatar_url": "https://avatars.githubusercontent.com/u/864578?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/johanneswuerbach",
            "html_url": "https://github.com/johanneswuerbach",
            "followers_url": "https://api.github.com/users/johanneswuerbach/followers",
            "following_url": "https://api.github.com/users/johanneswuerbach/following{/other_user}",
            "gists_url": "https://api.github.com/users/johanneswuerbach/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/johanneswuerbach/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/johanneswuerbach/subscriptions",
            "organizations_url": "https://api.github.com/users/johanneswuerbach/orgs",
            "repos_url": "https://api.github.com/users/johanneswuerbach/repos",
            "events_url": "https://api.github.com/users/johanneswuerbach/events{/privacy}",
            "received_events_url": "https://api.github.com/users/johanneswuerbach/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "johanneswuerbach",
            "id": 864578,
            "avatar_url": "https://avatars.githubusercontent.com/u/864578?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/johanneswuerbach",
            "html_url": "https://github.com/johanneswuerbach",
            "followers_url": "https://api.github.com/users/johanneswuerbach/followers",
            "following_url": "https://api.github.com/users/johanneswuerbach/following{/other_user}",
            "gists_url": "https://api.github.com/users/johanneswuerbach/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/johanneswuerbach/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/johanneswuerbach/subscriptions",
            "organizations_url": "https://api.github.com/users/johanneswuerbach/orgs",
            "repos_url": "https://api.github.com/users/johanneswuerbach/repos",
            "events_url": "https://api.github.com/users/johanneswuerbach/events{/privacy}",
            "received_events_url": "https://api.github.com/users/johanneswuerbach/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "d507aa2fbed58b41a7798c60b3c6e0135388f544",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/d507aa2fbed58b41a7798c60b3c6e0135388f544",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/d507aa2fbed58b41a7798c60b3c6e0135388f544"
            }
          ]
        },
        {
          "sha": "d507aa2fbed58b41a7798c60b3c6e0135388f544",
          "commit": {
            "author": {
              "name": "Stefan Penner",
              "email": "stefan.penner@gmail.com",
              "date": "2016-06-03T03:16:15Z"
            },
            "committer": {
              "name": "Stefan Penner",
              "email": "stefan.penner@gmail.com",
              "date": "2016-06-03T03:16:15Z"
            },
            "message": "Merge pull request #5948 from chadhietala/stick-testem\n\n[WORKAROUND] Stick testem at 1.7.4",
            "tree": {
              "sha": "134790d74aa37d2a7ee6b9040a6a8bef45d0c04b",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/git/trees/134790d74aa37d2a7ee6b9040a6a8bef45d0c04b"
            },
            "url": "https://api.github.com/repos/ember-cli/ember-cli/git/commits/d507aa2fbed58b41a7798c60b3c6e0135388f544",
            "comment_count": 0
          },
          "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/d507aa2fbed58b41a7798c60b3c6e0135388f544",
          "html_url": "https://github.com/ember-cli/ember-cli/commit/d507aa2fbed58b41a7798c60b3c6e0135388f544",
          "comments_url": "https://api.github.com/repos/ember-cli/ember-cli/commits/d507aa2fbed58b41a7798c60b3c6e0135388f544/comments",
          "author": {
            "login": "stefanpenner",
            "id": 1377,
            "avatar_url": "https://avatars.githubusercontent.com/u/1377?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/stefanpenner",
            "html_url": "https://github.com/stefanpenner",
            "followers_url": "https://api.github.com/users/stefanpenner/followers",
            "following_url": "https://api.github.com/users/stefanpenner/following{/other_user}",
            "gists_url": "https://api.github.com/users/stefanpenner/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/stefanpenner/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/stefanpenner/subscriptions",
            "organizations_url": "https://api.github.com/users/stefanpenner/orgs",
            "repos_url": "https://api.github.com/users/stefanpenner/repos",
            "events_url": "https://api.github.com/users/stefanpenner/events{/privacy}",
            "received_events_url": "https://api.github.com/users/stefanpenner/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "stefanpenner",
            "id": 1377,
            "avatar_url": "https://avatars.githubusercontent.com/u/1377?v=3",
            "gravatar_id": "",
            "url": "https://api.github.com/users/stefanpenner",
            "html_url": "https://github.com/stefanpenner",
            "followers_url": "https://api.github.com/users/stefanpenner/followers",
            "following_url": "https://api.github.com/users/stefanpenner/following{/other_user}",
            "gists_url": "https://api.github.com/users/stefanpenner/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/stefanpenner/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/stefanpenner/subscriptions",
            "organizations_url": "https://api.github.com/users/stefanpenner/orgs",
            "repos_url": "https://api.github.com/users/stefanpenner/repos",
            "events_url": "https://api.github.com/users/stefanpenner/events{/privacy}",
            "received_events_url": "https://api.github.com/users/stefanpenner/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "sha": "6b0013397daae38b96e9856f72be0e39b8214912",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/6b0013397daae38b96e9856f72be0e39b8214912",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/6b0013397daae38b96e9856f72be0e39b8214912"
            },
            {
              "sha": "ef5a06a675759f3f7ac1a0690e1dafc87521af19",
              "url": "https://api.github.com/repos/ember-cli/ember-cli/commits/ef5a06a675759f3f7ac1a0690e1dafc87521af19",
              "html_url": "https://github.com/ember-cli/ember-cli/commit/ef5a06a675759f3f7ac1a0690e1dafc87521af19"
            }
          ]
        }
      ]);
      return latestCommit;
    } else {
      let until = moment(date).toJSON();
      let url = `https://api.github.com/repos/${repo}/commits?until=${until}`;
      let [latestCommit] = yield get(this, 'requestCache').cacheRequest(url);
      return latestCommit;
    }
  }),

  getPackage: task(function * (repo, commit) {
    let url = `https://raw.githubusercontent.com/${repo}/${commit}/package.json`;
    let data = yield get(this, 'requestCache').cacheRequest(url);

    return data;
  })
});
