#!/bin/bash

cd "$(dirname "$0")"
mkdir -p server/static/generated
cp -r client/dist/boodschapp/* server/static/generated
(cd server && node index.js)
