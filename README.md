# girtib-treller

## How to Develop

[Register a Github application](https://github.com/settings/applications/new).

    cp env.sh.example env.sh
    cp app/scripts/config.json.example app/scripts/config.json

Edit config.json to fill in the client ID you got from your new Github app.
Also update env.sh to fill in that same Github client ID as well as your client
secret. You also need a session key in env.sh; you can run
`openssl rand -base64 40` to generate a random session key.

    bundle install
    npm install
    foreman start

Visit [localhost:3001](http://localhost:3001/) in your browser.
