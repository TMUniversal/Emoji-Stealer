#!/bin/bash
echo "[I] | Docker Script"

if [ "$#" == "0" ]
  then
    echo "Pass a parameter."
    exit 1
fi

function runContainer () {
  echo "[I] | Spinning up a container in the background..."
  docker run -d -t emoji-stealer
  echo "[I] | Done."
}

function buildContainer () {
  echo "[I] | Building docker image"
  echo "[I] | Transpiling TypeScript source..."
  npm run build
  echo "[I] | TS build finished."
  echo "[I] | Building docker image..."
  docker build -t emoji-stealer .
  echo "[I] | Docker build finished."
}

if [ "$1" == "build" ]
  then
    buildContainer
elif [ "$1" == "run" ]
  then
    runContainer
elif [ "$1" == "build+run" ]
  then
    buildContainer
    runContainer
elif [ "$1" == "help" ]
  then
    echo "This script is makes dockerizing easier."
    echo "Options:"
    echo "  help:       This help page."
    echo "  build:      Build a container image"
    echo "  run:        Start a docker container with the bot"
    echo "  build+run:  Both of the above scripts"
else
  echo "[E] | Unknown operation. $0 help for help."
fi

echo "[I] | Script finished."