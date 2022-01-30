#!/bin/bash

################################ SCRIPT NAO UTILIZADO #########################
if [ -d $BASE_PATH ]; then
    cd $BASE_PATH
    git clone $URL $FOLDER_NAME
fi

if [ ! -d $BASE_PATH ]; then
    echo "Projeto nao clonado. Diretorio inexistente: $BASE_PATH"
fi
###############################################################################