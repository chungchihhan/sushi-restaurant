#!/bin/bash
set -e
pushd .

cd backend
echo "Now we are at:---------------"
pwd
yarn install --network-timeout 1000000
popd

echo "DEPLOYMENT_SOURCE: $DEPLOYMENT_SOURCE"
echo "DEPLOYMENT_TARGET: $DEPLOYMENT_TARGET"
rm -r $DEPLOYMENT_SOURCE/frontend

cp -r $DEPLOYMENT_SOURCE/* $DEPLOYMENT_TARGET/

