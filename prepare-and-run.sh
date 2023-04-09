#!/bin/bash

(cd client && ng build)

mkdir -p server/static/generated
cp -r client/dist/boodschapp/* server/static/generated
(cd server && node index.js)
