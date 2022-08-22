FROM debian:stretch-slim

WORKDIR /root/workfolder

SHELL ["/bin/bash", "-c"]

ENV ANDROID_SDK_ROOT=/root/android
ENV ANDROID_HOME=/root/android
ENV PATH=$PATH:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/cmdline-tools/tools/bin

COPY ./install_dependency.sh /root/workfolder

RUN cd /root/workfolder && chmod +x install_dependency.sh && ./install_dependency.sh && groupadd -r developer && useradd -r -g developer developer