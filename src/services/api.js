/**
 * NanoBanana API Service
 * Documentation: https://docs.nanobananaapi.ai/
 * - Credit Balance: https://docs.nanobananaapi.ai/common-api/get-account-credits
 * - Image Generation: https://docs.nanobananaapi.ai/nanobanana-api/generate-or-edit-image
 */

const API_BASE_URL = 'https://api.nanobananaapi.ai/api/v1';

/**
 * Get account credit balance
 * @returns {Promise<number>} The remaining credit quantity
 * @throws {Error} If the API request fails
 */
export const getAccountCredits = async () => {
  const apiKey = process.env.REACT_APP_NANOBANANA_API_KEY;
  
  if (!apiKey) {
    console.warn('NanoBanana API key not configured');
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/common/credit`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // Handle different response codes
    if (data.code === 200) {
      return data.data; // Returns the credit balance
    } else if (data.code === 401) {
      throw new Error('Unauthorized - Invalid API key');
    } else if (data.code === 402) {
      throw new Error('Insufficient Credits');
    } else if (data.code === 429) {
      throw new Error('Rate Limited - Too many requests');
    } else if (data.code === 500) {
      throw new Error('Server Error - Please try again later');
    } else {
      throw new Error(data.msg || 'Failed to fetch credits');
    }
  } catch (error) {
    console.error('Error fetching account credits:', error);
    throw error;
  }
};

/**
 * Format credit number with commas for better readability
 * @param {number} credits - The credit amount
 * @returns {string} Formatted credit string
 */
export const formatCredits = (credits) => {
  if (credits === null || credits === undefined) return '--';
  return credits.toLocaleString();
};

/**
 * Upload image to ImgBB and get public URL
 * ImgBB is a free image hosting service that provides public URLs
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} The public image URL
 */
export const uploadImageToImgBB = async (file) => {
  const apiKey = process.env.REACT_APP_IMGBB_API_KEY;
  
  if (!apiKey) {
    console.warn('ImgBB API key not configured, using base64...');
    // Fallback to base64 if no ImgBB key
    return uploadImageToBase64(file);
  }

  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', apiKey);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url; // Public URL
    } else {
      throw new Error(data.error?.message || 'Failed to upload image');
    }
  } catch (error) {
    console.error('ImgBB upload error:', error);
    // Fallback to base64
    console.log('Falling back to base64 encoding...');
    return uploadImageToBase64(file);
  }
};

/**
 * Convert image to base64 data URL (fallback method)
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} Base64 data URL
 */
export const uploadImageToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Generate or edit image using NanoBanana API
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - Text prompt describing the desired image
 * @param {string[]} params.imageUrls - Array of input image URLs (for IMAGETOIAMGE mode)
 * @param {string} params.type - Generation type: "TEXTTOIAMGE" or "IMAGETOIAMGE"
 * @param {number} params.numImages - Number of images to generate (1-4)
 * @param {string} params.image_size - Aspect ratio (e.g., "16:9", "1:1")
 * @param {string} params.callBackUrl - Callback URL for results
 * @param {string} params.watermark - Optional watermark text
 * @returns {Promise<string>} The task ID for tracking
 */
export const generateImage = async ({
  prompt,
  imageUrls = [],
  type = 'IMAGETOIAMGE',
  numImages = 1,
  image_size = '16:9',
  callBackUrl,
  watermark = ''
}) => {
  const apiKey = process.env.REACT_APP_NANOBANANA_API_KEY;
  
  if (!apiKey) {
    throw new Error('NanoBanana API key not configured');
  }

  if (!callBackUrl) {
    throw new Error('Callback URL is required');
  }

  try {
    const requestBody = {
      prompt,
      type,
      numImages,
      image_size,
      callBackUrl
    };

    // Add imageUrls only for IMAGETOIAMGE type
    if (type === 'IMAGETOIAMGE' && imageUrls.length > 0) {
      requestBody.imageUrls = imageUrls;
    }

    // Add watermark if provided
    if (watermark) {
      requestBody.watermark = watermark;
    }

    // Log the complete request for debugging
    console.log('=== NANOBANANA API REQUEST ===');
    console.log('Endpoint:', `${API_BASE_URL}/nanobanana/generate`);
    console.log('Method: POST');
    console.log('Headers:', {
      'Authorization': `Bearer ${apiKey.substring(0, 10)}...`,
      'Content-Type': 'application/json'
    });
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    console.log('Number of images:', imageUrls.length);
    console.log('Image URLs:', imageUrls);
    console.log('==============================');

    const response = await fetch(`${API_BASE_URL}/nanobanana/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // Handle different response codes
    if (data.code === 200) {
      return data.data.taskId;
    } else if (data.code === 400) {
      throw new Error('Parameter error - Please check your inputs');
    } else if (data.code === 401) {
      throw new Error('Unauthorized - Invalid API key');
    } else if (data.code === 500) {
      throw new Error('Server error - Please try again later');
    } else {
      throw new Error(data.msg || 'Failed to generate image');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

/**
 * Get task details and status
 * Documentation: https://docs.nanobananaapi.ai/nanobanana-api/get-task-details
 * @param {string} taskId - The task ID to query
 * @returns {Promise<Object>} Task details including status and result
 */
export const getTaskDetails = async (taskId) => {
  const apiKey = process.env.REACT_APP_NANOBANANA_API_KEY;
  
  if (!apiKey) {
    throw new Error('NanoBanana API key not configured');
  }

  try {
    // Correct endpoint: /record-info with query parameter
    const url = `${API_BASE_URL}/nanobanana/record-info?taskId=${taskId}`;
    console.log('Fetching task details from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Task details response status:', response.status);
    
    const data = await response.json();
    console.log('Task details response data:', data);

    if (data.code === 200) {
      return data.data;
    } else if (data.code === 404) {
      throw new Error('Task not found - please check task ID');
    } else {
      console.error('Task details error - Code:', data.code, 'Message:', data.msg);
      throw new Error(data.msg || `Failed to get task details (code: ${data.code})`);
    }
  } catch (error) {
    console.error('Error getting task details:', error);
    throw error;
  }
};

/**
 * Poll task status until completion
 * @param {string} taskId - The task ID to poll
 * @param {Function} onProgress - Callback for progress updates
 * @param {number} maxAttempts - Maximum polling attempts (default: 60)
 * @param {number} interval - Polling interval in ms (default: 5000)
 * @returns {Promise<Object>} Final task result
 */
export const pollTaskStatus = async (
  taskId, 
  onProgress = () => {}, 
  maxAttempts = 60,
  interval = 5000
) => {
  let attempts = 0;

  const poll = async () => {
    attempts++;
    console.log(`Polling attempt ${attempts}/${maxAttempts} for task ${taskId}`);
    
    try {
      const taskDetails = await getTaskDetails(taskId);
      
      console.log('Task details received:', taskDetails);
      console.log('successFlag:', taskDetails.successFlag);
      
      // Call progress callback
      onProgress(taskDetails);

      // Check task status based on successFlag
      // 0: GENERATING, 1: SUCCESS, 2: CREATE_TASK_FAILED, 3: GENERATE_FAILED
      if (taskDetails.successFlag === 1) {
        // SUCCESS - Task completed
        console.log('Task completed successfully!');
        console.log('Result image URL:', taskDetails.response?.resultImageUrl);
        
        // Return in format expected by component
        return {
          ...taskDetails,
          info: {
            resultImageUrl: taskDetails.response?.resultImageUrl || taskDetails.response?.originImageUrl
          }
        };
      } else if (taskDetails.successFlag === 2) {
        // CREATE_TASK_FAILED
        throw new Error('Failed to create task: ' + (taskDetails.errorMessage || 'Unknown error'));
      } else if (taskDetails.successFlag === 3) {
        // GENERATE_FAILED
        throw new Error('Image generation failed: ' + (taskDetails.errorMessage || 'Unknown error'));
      } else if (taskDetails.successFlag === 0) {
        // GENERATING - Still processing
        console.log('Task still generating, will retry in', interval/1000, 'seconds...');
      }

      // Continue polling if not completed and haven't exceeded max attempts
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, interval));
        return poll();
      } else {
        console.error('Task polling timeout after', attempts, 'attempts');
        throw new Error('Task polling timeout - Generation taking longer than expected. Task ID: ' + taskId);
      }
    } catch (error) {
      console.error('Polling error on attempt', attempts, ':', error);
      
      // If it's a network error or task not found yet, retry
      if (attempts < maxAttempts && 
          (error.message.includes('timeout') || 
           error.message.includes('network') ||
           error.message.includes('Task not found') ||
           error.message.includes('Failed to fetch'))) {
        console.log('Retrying in', interval/1000, 'seconds...');
        await new Promise(resolve => setTimeout(resolve, interval));
        return poll();
      }
      throw error;
    }
  };

  return poll();
};

