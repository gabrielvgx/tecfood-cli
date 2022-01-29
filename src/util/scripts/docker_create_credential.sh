#!/bin/bash

CLI_PATH=$('pwd')
AUTH_PATH="$CLI_PATH/src/build/config/"
REGISTRY=$1
USER=$2
PASSWORD=$3
docker --config $AUTH_PATH login $REGISTRY -u $USER -p $PASSWORD