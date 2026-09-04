/**
 * Smart Waste Collection Management System - AWS Client Configuration
 * Supports production AWS S3 / SNS and provides an enterprise simulation mode when offline.
 */
const env = require('./env');

const isAwsConfigured = Boolean(
  env.AWS.ACCESS_KEY_ID &&
  env.AWS.SECRET_ACCESS_KEY &&
  env.AWS.S3_BUCKET_NAME
);

module.exports = {
  isAwsConfigured,
  region: env.AWS.REGION,
  s3Bucket: env.AWS.S3_BUCKET_NAME,
  snsTopicArn: env.AWS.SNS_TOPIC_ARN,
  credentials: isAwsConfigured ? {
    accessKeyId: env.AWS.ACCESS_KEY_ID,
    secretAccessKey: env.AWS.SECRET_ACCESS_KEY
  } : null
};
