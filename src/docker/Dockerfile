FROM debian:stretch-slim
#ARG HTTP_PROXY
RUN apt-get update && apt-get install -y \
    wget \
    zip \
    unzip \
    rsync \
    default-jdk \
    curl 
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash &&\
    source ~/.bashrc && nvm install --lts
#ENV JAVA_HOME /
#ENV ANDROID_SDK_ROOT /

ENV http_proxy ${HTTP_PROXY}
ENV https_proxy ${HTTP_PROXY}
ENV PS1="\[\e]0;\u@\h \w\a\]${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[01;31m\]\$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/')\[\033[00m\] \$ "
#ENV PATH=${WORKSPACE}/app-teknisa/android-studio:$PATH