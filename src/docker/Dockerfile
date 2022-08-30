FROM debian:stretch-slim

ARG HOME_DIR=/home/developer
ARG DEFAULT_BUILD_TOOLS_VERSION="29.0.0"
ARG DEFAULT_PLATFORM_ANDROID_VERSION="27"
ARG USE_LATEST_VERSION="false"
ARG WORKFOLDER=${HOME_DIR}/workfolder

COPY ./scripts/* ${WORKFOLDER}/

RUN chmod +x ${WORKFOLDER}/*.sh && ${WORKFOLDER}/general.sh

USER developer

WORKDIR ${HOME_DIR}/workfolder