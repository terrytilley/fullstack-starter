#!/bin/bash

echo What should the version be?
read VERSION

docker build -t terrytilley/lireddit:$VERSION .
docker push terrytilley/lireddit:$VERSION
ssh root@167.99.95.34 "docker pull terrytilley/lireddit:$VERSION && docker tag terrytilley/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"
