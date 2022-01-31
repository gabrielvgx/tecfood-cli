#!/bin/bash

PATH_DOCKER_COMPOSE=$1
SERVICE_NAME=$2
{
    docker-compose up -d $SERVICE_NAME
    exit 0
} || {
    exit 1
}