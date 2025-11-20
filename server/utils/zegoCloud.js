const crypto = require('crypto');

// Generate ZegoCloud token for API authentication
const getZegoCloudToken = () => {
  const appId = process.env.ZEGOCLOUD_APP_ID;
  const serverSecret = process.env.ZEGOCLOUD_SERVER_SECRET;
  
  if (!appId || !serverSecret) {
    throw new Error('ZegoCloud credentials not configured');
  }

  // Create a nonce
  const nonce = crypto.randomBytes(16).toString('hex');
  
  // Create timestamp
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Create signature
  const signature = crypto
    .createHmac('sha256', serverSecret)
    .update(`${nonce}${timestamp}`)
    .digest('hex');
  
  // Construct token
  const token = `${appId}_${nonce}_${timestamp}_${signature}`;
  
  return token;
};

module.exports = getZegoCloudToken