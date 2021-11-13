#!bash

rm -rf deploy/client-deploy/client-build
cd client
npm run build
cd ..
rsync -av client/build/* deploy/client-deploy/client-build
rsync -av deploy/build-files/client-deploy/* deploy/client-deploy
# cd client && git push heroku master

rm -rf deploy/server-deploy/*
rsync -av server/* deploy/server-deploy --exclude node_modules
rsync -av deploy/build-files/server-deploy/* deploy/server-deploy