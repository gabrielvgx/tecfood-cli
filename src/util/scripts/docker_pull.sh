#!/bin/bash

IMAGE_TO_UPDATE=$1
{
    docker pull $IMAGE_TO_UPDATE
    exit 0
} || {
    exit 1
}