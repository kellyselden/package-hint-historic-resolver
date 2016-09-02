#!/bin/bash
set -ev
seed="${TRAVIS_PULL_REQUEST}"
if [ $seed = false ]; then
  seed="${TRAVIS_COMMIT}"
fi
SEED=$seed npm run travis
