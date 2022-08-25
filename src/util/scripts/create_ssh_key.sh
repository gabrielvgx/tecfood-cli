#!/bin/bash
EMAIL=$1
{
    clear
    yes | ssh-keygen -t rsa -b 2048 -f $HOME/.ssh/id_rsa -q -N "" -C $EMAIL 1> /dev/null 
    SSH_KEY=$(cat $HOME/.ssh/id_rsa.pub)
    echo $SSH_KEY
} || {
    echo 'Error create SSH'
}