#!/bin/bash
build_image(){
    docker build \
    -t app-image \
    --build-arg WORKSPACE=/home/developer/workfolder \
    --build-arg HTTP_PROXY=http://192.168.122.121:3128
    - < Dockerfile
}
login(){
    docker login \
    dockerhub.teknisa.com \
    -u teknisa \
    -p teknisa2020
}
up_container(){
    docker run \
    -d \
    --name app-container \
    -p 3200:80 \
    -v /home/$USER/app-workspace:/home/developer/workfolder \
    --restart=always \
    -it app-image:latest
}
#login 
up_container