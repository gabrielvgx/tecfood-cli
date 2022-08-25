FROM debian:stretch-slim

SHELL [ "/bin/bash", "-l", "-c" ]

ARG HOME_DIR=/home/developer
ARG DEFAULT_BUILD_TOOLS_VERSION="29.0.0"
ARG DEFAULT_PLATFORM_ANDROID_VERSION="27"
ARG USE_LATEST_VERSION="true"
ARG WORKFOLDER=${HOME_DIR}/workfolder

COPY ./configure_user.sh ${WORKFOLDER}/configure_user.sh
COPY ./install_dependency.sh ${WORKFOLDER}/install_dependency.sh

RUN chmod +x ${WORKFOLDER}/configure_user.sh && chmod +x ${WORKFOLDER}/install_dependency.sh && ${WORKFOLDER}/configure_user.sh &&\
    chown developer:developer ${WORKFOLDER}/install_dependency.sh
USER developer

RUN ${WORKFOLDER}/install_dependency.sh ${USE_LATEST_VERSION}

WORKDIR ${HOME_DIR}/workfolder