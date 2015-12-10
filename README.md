# girtib-treller

![Screenshot](https://raw.githubusercontent.com/cheshire137/girtib-treller/master/screenshot1.png)

## How to Run Locally

[Register a Github application](https://github.com/settings/applications/new).
For local development, set its 'Authorization callback URL' to
`http://localhost:5000/auth/github/callback` For deployment, its callback URL
will be whatever your host is plus `/auth/github/callback`

    cp env.sh.example env.sh
    cp app/scripts/config.json.example app/scripts/config.json

Update env.sh to fill in the client ID from your new Github app as well
as your client secret. You also need a session key in env.sh; you can run
`openssl rand -base64 40` to generate a random session key.

    bundle install
    npm install
    foreman start -f Procfile.dev

Visit [localhost:3001](http://localhost:3001/) in your browser.

## How to Deploy to Heroku

### First Time

1. [Create a new app on Heroku](https://dashboard.heroku.com/apps).
1. `git remote add heroku git@heroku.com:yourherokuapp.git`
1. `heroku config:add BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-ruby.git`
1. `heroku config:set RACK_ENV=production`
1. `heroku config:set GITHUB_CLIENT_ID=your_github_app_client_id`
1. `heroku config:set GITHUB_CLIENT_SECRET=your_github_app_client_secret`
1. `heroku config:set SESSION_KEY="your_session_key"`
1. `heroku config:set FRONT_END_URL=url_to_your_heroku_app`
1. `git push heroku master`
1. `heroku ps:scale web=1`

### After It Has Been Deployed Once

    ./deploy.sh

![Ermagerd](https://raw.githubusercontent.com/cheshire137/girtib-treller/master/ermagerd.jpg)
