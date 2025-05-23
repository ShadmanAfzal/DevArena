#!/bin/bash

IMAGE_NAME="dev-arena-executor"

echo "Stopping and removing all containers using image: $IMAGE_NAME"
container_ids=$(docker ps -a -q --filter ancestor=$IMAGE_NAME)

if [ -n "$container_ids" ]; then
  docker rm -f $container_ids
  echo "Containers removed."
else
  echo "No containers found for image $IMAGE_NAME."
fi

echo "Removing image: $IMAGE_NAME"
docker rmi -f $IMAGE_NAME || echo "Image not found or already removed."

echo "Rebuilding image: $IMAGE_NAME"
docker build -t $IMAGE_NAME .

echo "Done."
