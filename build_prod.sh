#!/bin/bash

hash=$(git rev-parse --short HEAD)
ARG1=$1
TAG=${ARG1:=$hash}

npm run build
docker build . -t teacher_app:$TAG
