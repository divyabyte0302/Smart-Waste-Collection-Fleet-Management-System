/**
 * Modular Storage Service for Complaints
 * Integrates with Amazon S3 Modular Storage Service with local fallback.
 */
const s3Service = require('../../services/storage/s3.service');

const complaintStorage = {
  /**
   * Store image from Base64 Data URL or raw Buffer via S3 Storage Service
   * @param {string|Buffer} imageData - Base64 Data URI or file buffer
   * @param {string} [suggestedExt='jpg']
   * @returns {string} Public accessible or S3 URL
   */
  saveImage(imageData, suggestedExt = 'jpg') {
    if (!imageData) return null;

    // If it's already an HTTP URL or local /uploads URL, return as is
    if (typeof imageData === 'string' && (imageData.startsWith('http://') || imageData.startsWith('https://') || imageData.startsWith('/uploads/'))) {
      return imageData;
    }

    try {
      let buffer;
      let extension = suggestedExt;

      if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mime = matches[1];
          extension = mime.split('/')[1] || 'jpg';
          if (extension === 'jpeg') extension = 'jpg';
          buffer = Buffer.from(matches[2], 'base64');
        } else {
          buffer = Buffer.from(imageData, 'base64');
        }
      } else if (Buffer.isBuffer(imageData)) {
        buffer = imageData;
      } else {
        return null;
      }

      // Synchronous local save + S3 service invocation
      const filename = `complaint_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
      
      // We run uploadImage
      s3Service.uploadImage(buffer, filename, `image/${extension}`, 'complaints')
        .catch(err => console.warn('[Storage] Async S3 upload notice:', err.message));

      // Return generated public URL from s3Service
      return s3Service.getImageUrl(`complaints/${filename}`);
    } catch (err) {
      console.error('[ComplaintStorage] Failed to save image:', err);
      return null;
    }
  },

  /**
   * Delete image file by URL via S3 Storage Service
   * @param {string} fileUrl
   */
  deleteImage(fileUrl) {
    if (!fileUrl) return;
    s3Service.deleteImage(fileUrl)
      .catch(err => console.warn('[Storage] Image delete notice:', err.message));
  }
};

module.exports = complaintStorage;
