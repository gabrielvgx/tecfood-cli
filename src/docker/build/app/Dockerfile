FROM debian:stretch-slim

WORKDIR /root/workfolder
SHELL ["/bin/bash", "-c"]
COPY ./install.sh /root/workfolder
RUN cd /root/workfolder && chmod +x install.sh && ./install.sh
ENV ANDROID_SDK_ROOT=/root/android
ENV ANDROID_HOME=/root/android
ENV PATH=$PATH:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/cmdline-tools/tools/bin