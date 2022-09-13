#!/bin/bash

PATH_DOCKER_COMPOSE=$1
SERVICE_NAME=$2
{
    export COMPOSE_IGNORE_ORPHANS=True
    cd $PATH_DOCKER_COMPOSE
    docker-compose up -d $SERVICE_NAME
    exit 0
} || {
    exit 1
}