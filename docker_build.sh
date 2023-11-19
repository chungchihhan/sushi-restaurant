#!/bin/bash

set -e

# build backend image
echo "Building backend image"
docker build -t sushi-backend -f backend/Dockerfile .
echo "Building frontend image"
docker build --build-arg REACT_APP_API_URL= -t sushi-frontend -f frontend/Dockerfile .

# run an backend container
# docker run --rm -p 8000:8000 sushi-backend
# docker run --rm -p 3000:3000 sushi-frontend
