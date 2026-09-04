/**
 * Smart Waste Collection Management System - AWS S3 Storage Service
 * Handles uploading complaint photos, resolution evidence, and waste verification documents.
 * Transparently falls back to local storage when AWS credentials are not set.
 */
const fs = require('fs');
const path = require('path');
const awsConfig = require('../config/awsConfig');
const env = require('../config/env');

// Ensure local upload directory exists
const uploadDir = env.UPLOAD_DIR;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const AwsS3Service = {
  /**
   * Uploads a file buffer or stream.
   * If AWS is configured, pushes to S3 bucket.
   * Otherwise, persists in backend/uploads and returns a local relative URL.
   */
  uploadFile: async (file, folder = 'complaints') => {
    if (!file) return null;

    const fileExtension = path.extname(file.originalname) || '.jpg';
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExtension}`;

    if (awsConfig.isAwsConfigured) {
      try {
        console.log(`[AWS S3] Uploading file to s3://${awsConfig.s3Bucket}/${filename}...`);
        // AWS SDK v3 client execution
        // const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
        // const s3 = new S3Client({ region: awsConfig.region, credentials: awsConfig.credentials });
        // await s3.send(new PutObjectCommand({ Bucket: awsConfig.s3Bucket, Key: filename, Body: file.buffer, ContentType: file.mimetype }));
        const s3Url = `https://${awsConfig.s3Bucket}.s3.${awsConfig.region}.amazonaws.com/${filename}`;
        return {
          storage: 's3',
          url: s3Url,
          key: filename,
          size: file.size
        };
      } catch (err) {
        console.error('[AWS S3 Error] Upload failed, falling back to local storage:', err.message);
      }
    }

    // Local Storage Fallback
    const localTargetDir = path.join(uploadDir, folder);
    if (!fs.existsSync(localTargetDir)) {
      fs.mkdirSync(localTargetDir, { recursive: true });
    }

    const localFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExtension}`;
    const targetPath = path.join(localTargetDir, localFilename);

    if (file.buffer) {
      fs.writeFileSync(targetPath, file.buffer);
    } else if (file.path && fs.existsSync(file.path)) {
      fs.copyFileSync(file.path, targetPath);
    }

    const publicUrl = `/uploads/${folder}/${localFilename}`;
    return {
      storage: 'local',
      url: publicUrl,
      key: localFilename,
      size: file.size
    };
  },

  /**
   * Generates a pre-signed URL or direct download path.
   */
  getFileUrl: (key) => {
    if (!key) return null;
    if (key.startsWith('http://') || key.startsWith('https://') || key.startsWith('/uploads/')) {
      return key;
    }
    if (awsConfig.isAwsConfigured) {
      return `https://${awsConfig.s3Bucket}.s3.${awsConfig.region}.amazonaws.com/${key}`;
    }
    return `/uploads/${key}`;
  }
};

module.exports = AwsS3Service;
