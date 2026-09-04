#!/bin/bash
# ==============================================================================
# AWS S3 Bucket Setup & CORS Configuration
# ==============================================================================

BUCKET_NAME=${1:-"smartwaste-media-assets-prod"}
REGION=${2:-"us-east-1"}

echo "Creating S3 bucket: $BUCKET_NAME in $REGION..."
aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"

echo "Applying CORS policy for browser uploads..."
aws s3api put-bucket-cors --bucket "$BUCKET_NAME" --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}'

echo "S3 Setup completed successfully."
