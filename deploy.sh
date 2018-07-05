export PROJECT_ID="$(gcloud config get-value project -q)"
echo 'Building front-end...'
npm run build-prod

echo 'Building back-end...'
npm run build-server

echo 'Building docker image...'
docker build -t gcr.io/${PROJECT_ID}/my-app:latest .
echo 'Pushing docker image...'
gcloud docker -- push gcr.io/${PROJECT_ID}/my-app:latest

echo 'Pausing for 10s to ensure gcloud container registry is ready...'
sleep 10

echo 'Restarting instance with new docker image...'
gcloud beta compute instances update-container ${PROJECT_ID} \
     --container-image gcr.io/${PROJECT_ID}/my-app:latest

echo 'Deploy complete.'
gcloud compute instances list
