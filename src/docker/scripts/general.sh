#!/bin/bash

cd $WORKFOLDER

./configure_user.sh

export HOME=$HOME_DIR
export USER=developer

./install_dependency.sh $USE_LATEST_VERSION