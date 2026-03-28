#!/bin/bash

# PRODUCTION
echo "🚀 Starting production deployment..."

# Reset & pull latest code
git reset --hard
git checkout main
git pull origin main

npm i yarn -g
yarn global add serve
yarn
yarn run build
pm2 start "yarn run start:prod" --name=COMFYZONE-REACT
pm2 save

echo "✅ Production deployment complete!"


