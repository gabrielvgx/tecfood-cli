#!/bin/bash
BUILD_CONTAINER=$1

docker rm -f $(docker ps  --filter "status=exited" --format="{{.ID}}")
docker rm -f $(docker ps  --filter "status=created" --format="{{.ID}}")
docker rmi $(docker images -f "dangling=true" -q)

docker build -t gvgx/cordova-app-tecfood:latest .

if [ $BUILD_CONTAINER = "true" ]; then
    docker rm -f app_container
    docker rmi $(docker images -f "dangling=true" -q)
    docker run -d -it --name app_container gvgx/cordova-app-tecfood:latest
fi