#!/bin/bash

TYPE_OPERATION=$1
PATH_APP_CORDOVA=$2

cd $PATH_APP_CORDOVA

if [ $TYPE_OPERATION = "DEBUG" ]; then
    cordova build android
fi

if [ $TYPE_OPERATION = "RELEASE" ]; then
    cordova build android --release -- --keystore=./keystore --storePassword=keystore --alias=chave --password=keystore
fi