#!/bin/bash

hash=$(./version.sh)
ARG1=$1
TAG=${ARG1:=$hash}
new_image="docker.io/niole/teacher_app:$TAG"

npm run build
docker build --no-cache . -t docker.io/niole/teacher_app:$TAG && docker push docker.io/niole/teacher_app:$TAG

echo ""
echo "New Tag: ${TAG}"
echo "New image: ${new_image}"
