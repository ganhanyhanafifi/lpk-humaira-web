/**
 * Uploads a file to Cloudinary (100% Free Storage, no credit card required).
 *
 * @param {File} file - The file to upload (JPG, PNG, PDF, etc).
 * @param {string} path - Folder/filename context (optional metadata).
 * @param {Function} onProgress - Callback function for upload progress percentage (0-100).
 * @returns {Promise<string>} A promise that resolves to the secure download URL.
 */
export const uploadFile = (file, path, onProgress) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'bvpemcqm';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'preset_hai';

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    // Pass folder info if provided
    if (path) {
      const folderParts = path.split('/');
      if (folderParts.length > 1) {
        formData.append('folder', folderParts.slice(0, -1).join('/'));
      }
    }

    const xhr = new XMLHttpRequest();
    // 'auto' resource type automatically handles images, raw files (PDF), etc.
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        console.error('Cloudinary upload error:', xhr.responseText);
        reject(new Error(`Upload failed (${xhr.status}): Please make sure Cloudinary unsigned upload preset is enabled.`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Koneksi internet terputus saat mengunggah file.'));
    };

    xhr.send(formData);
  });
};

/**
 * Dummy delete function for interface compatibility.
 * Cloudinary free tier deletion is managed via dashboard or signed API.
 */
export const deleteFile = async (path) => {
  console.log('Delete file called for path:', path);
  return Promise.resolve();
};

/**
 * Generates a standard file path for uploads.
 *
 * @param {string} folderName - The subfolder name (e.g., student name).
 * @param {string} fileName - The original file name.
 * @returns {string} The generated path.
 */
export const generateFilePath = (folderName, fileName) => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const timestamp = date.getTime();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  
  return `pendaftaran/${dateStr}/${folderName}/${timestamp}_${cleanFileName}`;
};
