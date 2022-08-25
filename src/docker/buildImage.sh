#!/bin/bash
TAG_NAME=$1
BUILD_CONTAINER=$2

if [ -z $BUILD_CONTAINER ]; then
    BUILD_CONTAINER="false"
fi

if [ -z $TAG_NAME ]; then
    TAG_NAME="latest"
fi

docker rm -f $(docker ps  --filter "status=exited" --format="{{.ID}}")
docker rm -f $(docker ps  --filter "status=created" --format="{{.ID}}")
docker rmi $(docker images -f "dangling=true" -q)

docker build -t "gvgx/cordova-app-tecfood:$TAG_NAME" .

if [ $BUILD_CONTAINER = "true" ]; then
    docker rm -f app_container
    docker rmi $(docker images -f "dangling=true" -q)
    docker run -d -it --name app_container "gvgx/cordova-app-tecfood:$TAG_NAME"
fi