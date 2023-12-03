#!/bin/bash
set -e
pushd .

cd frontend
pwd
yarn install --network-timeout 1000000
yarn global add serve
yarn build
popd

echo "DEPLOYMENT_SOURCE: $DEPLOYMENT_SOURCE"
echo "DEPLOYMENT_TARGET: $DEPLOYMENT_TARGET"

cp -r $DEPLOYMENT_SOURCE/frontend/build $DEPLOYMENT_TARGET/build

