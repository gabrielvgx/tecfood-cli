#!/bin/bash
################################ SCRIPT NAO UTILIZADO #########################
HOME_DIR="$HOME"
yes | ssh-keygen -t ed25519 -C "gabriel.xavier@teknisa.com" -f $HOME_DIR/.ssh/id_ed25519 -P ""
cat $HOME_DIR/.ssh/id_ed25519.pub
ssh-keygen -f "$HOME_DIR/.ssh/known_hosts" -R gitlab.teknisa.com
###############################################################################
ssh-keygen -t rsa -C "gabriel.xavier@teknisa.com"