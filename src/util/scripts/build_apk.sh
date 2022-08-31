#!/bin/bash

PATH_APP_CORDOVA=$1
TYPE_OPERATION=$2

cd $PATH_APP_CORDOVA

if [ $TYPE_OPERATION = "BUILD_DEBUG" ]; then
    cordova build android
fi

if [ $TYPE_OPERATION = "BUILD_RELEASE" ]; then
    cordova build android --release -- --keystore=./keystore --storePassword=keystore --alias=chave --password=keystore
fi