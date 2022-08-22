#!/bin/bash

function install_required_deps {
    apt-get update && apt-get install -y --no-install-recommends \
        wget \
        zip \
        unzip \
        rsync \
        default-jdk \
        curl \
        openssh-client \
        git-all
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install --lts
    npm install -g tecfood-apkgen cordova bower
}

function custom_bash {
    echo "export PS1=\"\[\e]0;\u@\h \w\a\]${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[01;31m\]\$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/')\[\033[00m\] \$ \"" \
        >> ~/.bashrc
    source ~/.bashrc
}
 
function install_deps_android {
    cd ~  
    mkdir -p android/cmdline-tools 
    wget -O sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip
    unzip sdk-tools.zip && mv cmdline-tools ~/android/cmdline-tools/tools
    rm -rf sdk-tools.zip
    curl -s "https://get.sdkman.io" | bash 
    source "/root/.sdkman/bin/sdkman-init.sh"
    sdk install gradle
    yes | sdkmanager --install "build-tools;29.0.0"
    yes | sdkmanager --install "platforms;android-27"
}

function clean {
    apt-get remove -y curl wget unzip zip 
    apt-get clean
    apt-get autoclean
    apt-get autoremove
    rm -rf /var/lib/apt/lists/*
}

{
    install_required_deps && custom_bash && install_deps_android && clean
} || {
    echo 'Error install deps'
    exit 1
}