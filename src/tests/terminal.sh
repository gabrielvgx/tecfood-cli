#!/bin/bash
{
    docker info --format '{{.IndexServerAddress}}'
} || {
    exit 1
}
# docker info --format '{{.IndexServerAddress}}'
exit 0