#!/bin/bash
set -ev
seed="${TRAVIS_PULL_REQUEST}"
if [ $seed = false ]; then
  seed=""
fi
SEED=$seed npm run travis
