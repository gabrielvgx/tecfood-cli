#!/bin/bash

function configure_default_user {
    apt-get update && apt-get install sudo
    groupadd -r -g 1000 developer
    useradd -g 1000 -G sudo -u 1000 -s /bin/bash --home /home/developer -s /bin/bash developer
    cp -r /etc/skel/. /home/developer
    chown developer:developer /home/developer
    chown developer:developer /home/developer/.*
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
}

{
    configure_default_user
} || {
    echo 'Error in Configure User'
    exit 1
}