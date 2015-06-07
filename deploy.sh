#!/usr/bin/env bash

gulp clean
gulp build
git add -A dist
git commit -m "Update dist/"
git push origin master
git push heroku master
