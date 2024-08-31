#!/bin/bash

hash=$(./version.sh)
ARG1=$1
TAG=${ARG1:=$hash}

npm run build
docker build . -t docker.io/niole/teacher_app:$TAG
