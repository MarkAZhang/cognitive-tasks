You will need to generate a gcloud-secret-key in order to use the database.

You should have gcloud sdk installed locally, and have created a gcloud project that you will deploy this app to.

Run:

```
gcloud iam service-accounts create [NAME]

gcloud projects add-iam-policy-binding [PROJECT_ID] --member "serviceAccount:[NAME]@[PROJECT_ID].iam.gserviceaccount.com" --role "roles/owner"

gcloud iam service-accounts keys create gcloud-secret-key.json --iam-account [NAME]@[PROJECT_ID].iam.gserviceaccount.com
```

where [NAME] is a name of your choosing and [PROJECT_ID] is your gcloud project.
