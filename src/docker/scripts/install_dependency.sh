#!/bin/bash

USE_LATEST_VERSION=$1

function install_required_deps {
    sudo apt-get update && sudo apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        wget \
        zip \
        unzip \
        rsync \
        default-jdk \
        openssh-client \
        git-all
}

function configure_nvm {
    export NVM_DIR="$HOME/.nvm" && (
        git clone https://github.com/nvm-sh/nvm.git "$NVM_DIR"
        cd "$NVM_DIR"
        git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
    ) && \. "$NVM_DIR/nvm.sh"

    echo -e "export NVM_DIR=\"$HOME/.nvm\" \n [ -s \"$NVM_DIR/nvm.sh\" ] && \. \"$NVM_DIR/nvm.sh\" \n [ -s \"$NVM_DIR/bash_completion\" ] && \. \"$NVM_DIR/bash_completion\" " \
        >> /home/developer/.bashrc
    source /home/developer/.bashrc

    nvm install --lts 
    npm install -g tecfood-apkgen cordova bower
}

function custom_bash {
    echo "export PS1=\"\[\e]0;\u@\h \w\a\]${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[01;31m\]\$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/')\[\033[00m\] \$ \"" \
        >> ~/.bashrc
    source ~/.bashrc
}

function buildEnvVariablesAndroid {
    export ANDROID_SDK_ROOT=$HOME/android
    export ANDROID_HOME=$ANDROID_SDK_ROOT
    export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/cmdline-tools/tools/bin

    printf '%s\n' \
            "export ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT" \
            "export ANDROID_HOME=$ANDROID_HOME" \
            "export PATH=$PATH" \
            >> $HOME/.bashrc
    source $HOME/.bashrc
}
 
function install_deps_android {
    DEFAULT_TOOLS_LINK="https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip"
    DOWNLOAD_PAGE="https://developer.android.com/studio\#downloads"
    PREFIX_MATCH_TOOLS="https://dl.google.com/android/repository/commandlinetools-linux-"

    cd $HOME
    mkdir -p android/cmdline-tools 
    {
        LATEST_TOOLS=$(curl $DOWNLOAD_PAGE | grep -i $PREFIX_MATCH_TOOLS | grep -Eo 'https://[^ >"]+')
        wget -O sdk-tools.zip $LATEST_TOOLS
    } || {
        wget -O sdk-tools.zip $DEFAULT_TOOLS_LINK
    }
    
    if [ -f ./sdk-tools.zip ]; then
        unzip sdk-tools.zip && mv cmdline-tools $HOME/android/cmdline-tools/tools
        curl -s "https://get.sdkman.io" | bash 
        source "/home/developer/.sdkman/bin/sdkman-init.sh"
        sdk install gradle

        buildEnvVariablesAndroid
        
        BUILD_TOOLS_VERSION=""
        PLATFORMS_ANDROID_VERSION=""

        if [ $USE_LATEST_VERSION = "true" ]; then
            BUILD_TOOLS_VERSION=$(sdkmanager --list | grep -i 'build-tools;' | tail -1 | grep -Eo '[^ ]+' | head -1 | grep -Eio '[0-9.]+')
            PLATFORMS_ANDROID_VERSION=$(sdkmanager --list | grep -Eio 'platforms;android-[0-9]{2}' | tail -1 | grep -Eio '[0-9.]+')
        fi

        if [ -z $BUILD_TOOLS_VERSION ]; then
            BUILD_TOOLS_VERSION=$DEFAULT_BUILD_TOOLS_VERSION
        fi
        if [ -z $PLATFORMS_ANDROID_VERSION ]; then
            PLATFORMS_ANDROID_VERSION=$DEFAULT_PLATFORM_ANDROID_VERSION
        fi
        echo "================================================================"
        echo "build-tools: $BUILD_TOOLS_VERSION"
        echo "platforms;android: $PLATFORMS_ANDROID_VERSION"
        echo "================================================================"
        yes | sdkmanager --install "build-tools;$BUILD_TOOLS_VERSION"
        yes | sdkmanager --install "platforms;android-$PLATFORMS_ANDROID_VERSION"

    else
        echo 'Error install android_deps'
        exit 1
    fi
}

function clean {
    sudo apt-get remove -y curl wget unzip zip 
    sudo apt-get clean -y
    sudo apt-get autoclean -y
    sudo apt-get autoremove -y
    sudo rm -rf /var/lib/apt/lists/*
    sudo rm -rf ~/sdk-tools.zip
}

{
    install_required_deps   &&\
    configure_nvm           &&\
    install_deps_android    &&\
    custom_bash             &&\
    clean
} || {
    echo 'Error install deps'
    exit 1
}