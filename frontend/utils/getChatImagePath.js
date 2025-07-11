// utils/getChatImagePath.js
const getChatImagePath = (msg) => {
  if (!msg || !msg.file_url) return null;

  // If the path is already correct, use it directly
  if (msg.file_url.startsWith('/uploads/chat/')) {
    return `${import.meta.env.VITE_API_URL}${msg.file_url}`;
  }

  // fallback or future formats
  return null;
};


export default getChatImagePath;
