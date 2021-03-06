#!/bin/bash

REGISTRY=$1
USER=$2
PASSWORD=$3
AUTH_PATH=$4

{
    docker --config $AUTH_PATH login $REGISTRY -u $USER -p $PASSWORD
    exit 0
} || {
    exit 1
}