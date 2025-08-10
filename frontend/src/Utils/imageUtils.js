// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  return `${baseUrl}${imagePath}`;
};

// Alternative: hardcoded for production
export const getImageUrlHardcoded = (imagePath) => {
  if (!imagePath) return '';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Hardcoded production backend URL
  const baseUrl = 'https://eshop-backend-iq47.onrender.com';
  return `${baseUrl}${imagePath}`;
};
