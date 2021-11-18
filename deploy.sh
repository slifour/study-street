rm -rf deploy/client-deploy/client-build
rsync -av client/build/* deploy/client-deploy/client-build
rsync -av deploy/build-files/client-deploy/* deploy/client-deploy
cd deploy/client-deploy
git add .
git commit -m "deploy"
git push heroku master
cd ../..

rm -rf deploy/server-deploy/*
rsync -av server/* deploy/server-deploy --exclude node_modules
rsync -av deploy/build-files/server-deploy/* deploy/server-deploy
cd deploy/server-deploy
git add .
git commit -m "deploy"
git push heroku master