#!/bin/bash

TAG=$1
npm run build
docker build . -t teacher_app:$TAG
