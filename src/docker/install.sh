#### DOCKERFILE

FROM debian:stretch-slim
#ARG HTTP_PROXY
#ENV PS1="\[\e]0;\u@\h \w\a\]${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[01;31m\]\$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/')\[\033[00m\] \$ "
WORKDIR /root/workfolder
SHELL ["/bin/bash", "-c"]
COPY ./install.sh /root/workfolder
RUN cd /root/workfolder && chmod +x install.sh && ./install.sh
#ENV JAVA_HOME /
#RUN useradd -rm -d /home/ubuntu -s /bin/bash -g root -G sudo -u 1001 ubuntu
#USER ubuntu
#ENV http_proxy ${HTTP_PROXY}
#ENV https_proxy ${HTTP_PROXY}
ENV ANDROID_SDK_ROOT=/root/android
ENV PATH=$PATH:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/cmdline-tools/tools/bin

#ENV PATH=${WORKSPACE}/app-teknisa/android-studio:$PATH

###############


#!/bin/bash

apt-get clean && apt-get autoclean && apt-get autoremove && apt-get update && apt-get install -y --no-install-recommends \
    wget \
    zip \
    unzip \
    rsync \
    default-jdk \
    curl \
    openssh-client \
    git-all &&\
    rm -rf /var/lib/apt/lists/* &&\
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash &&\
    echo "export PS1=\"\[\e]0;\u@\h \w\a\]${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[01;31m\]\$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/')\[\033[00m\] \$ \"" \
    >> ~/.bashrc &&\
    source ~/.bashrc && nvm install --lts &&\
    cd ~  && mkdir -p android/cmdline-tools && npm install -g tecfood-apkgen cordova bower &&\
    wget -O sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip &&\
    unzip sdk-tools.zip && mv cmdline-tools ~/android/cmdline-tools/tools &&\
    rm -rf sdk-tools.zip &&\
curl -s "https://get.sdkman.io" | bash && source "/root/.sdkman/bin/sdkman-init.sh" &&\ 
    sdk install gradle &&\
    apt-get remove -y curl wget unzip zip && apt-get clean