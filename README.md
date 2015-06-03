# girtib-treller

## How to Run Locally

[Register a Github application](https://github.com/settings/applications/new).

    cp env.sh.example env.sh
    cp app/scripts/config.json.example app/scripts/config.json

Update env.sh to fill in the client ID from your new Github app as well
as your client secret. You also need a session key in env.sh; you can run
`openssl rand -base64 40` to generate a random session key.

    bundle install
    npm install
    foreman start

Visit [localhost:3001](http://localhost:3001/) in your browser.

![Ermagerd](https://raw.githubusercontent.com/moneypenny/girtib-treller/master/ermagerd.jpg)
