#!/bin/bash
set -e
pushd .

cd frontend
pwd
yarn install --network-timeout 1000000
popd

echo "DEPLOYMENT_SOURCE: $DEPLOYMENT_SOURCE"
echo "DEPLOYMENT_TARGET: $DEPLOYMENT_TARGET"

rm -r $DEPLOYMENT_SOURCE/backend

cp -r $DEPLOYMENT_SOURCE/* $DEPLOYMENT_TARGET/

