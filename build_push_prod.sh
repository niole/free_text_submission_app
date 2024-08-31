#!/bin/bash

hash=$(./version.sh)
ARG1=$1
TAG=${ARG1:=$hash}

echo "New Tag: ${TAG}"

npm run build
docker build . -t docker.io/niole/teacher_app:$TAG && docker push docker.io/niole/teacher_app:$TAG
